import { WorkflowJsonDefinition } from '@pravah/shared';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateWorkflowDefinition(def: WorkflowJsonDefinition): ValidationResult {
  const errors: string[] = [];

  if (!def.code || typeof def.code !== 'string') {
    errors.push('Workflow definition must have a valid string code.');
  }
  if (!def.stages || typeof def.stages !== 'object' || Object.keys(def.stages).length === 0) {
    errors.push('Workflow definition must define at least one stage.');
    return { valid: false, errors };
  }

  const stageKeys = new Set(Object.keys(def.stages));

  if (!def.initial || !stageKeys.has(def.initial)) {
    errors.push(`Initial stage "${def.initial}" does not exist in defined stages.`);
  }

  let hasTerminal = false;

  for (const [key, stage] of Object.entries(def.stages)) {
    if (stage.kind === 'terminal') {
      hasTerminal = true;
      continue;
    }

    // Auto stage checks
    if (stage.kind === 'auto') {
      if (!stage.next) {
        errors.push(`Auto stage "${key}" must define a "next" target stage.`);
      } else if (!stageKeys.has(stage.next)) {
        errors.push(`Auto stage "${key}" targets non-existent stage "${stage.next}".`);
      }
    }

    // Human stage checks
    if (stage.kind === 'human') {
      if (!stage.roles || stage.roles.length === 0) {
        errors.push(`Human stage "${key}" must assign at least one authorized role.`);
      }
      if (!stage.slaWorkingDays || stage.slaWorkingDays <= 0) {
        errors.push(`Human stage "${key}" must specify positive slaWorkingDays.`);
      }
    }

    // Statutory stage check
    if (stage.statutory && (!stage.roles || stage.roles.length === 0)) {
      errors.push(`Statutory stage "${key}" must have authorized roles explicitly declared.`);
    }

    // Action targets
    if (stage.actions) {
      if (Object.keys(stage.actions).length === 0 && stage.kind !== 'terminal') {
        errors.push(`Stage "${key}" has empty actions object and is not terminal.`);
      }
      for (const [actionName, targetStage] of Object.entries(stage.actions)) {
        if (!stageKeys.has(targetStage)) {
          errors.push(`Stage "${key}" action "${actionName}" targets non-existent stage "${targetStage}".`);
        }
      }
    } else if (stage.kind !== 'auto' && stage.kind !== 'terminal' && !stage.next) {
      errors.push(`Non-terminal stage "${key}" must define either "actions" or "next".`);
    }
  }

  if (!hasTerminal) {
    errors.push('Workflow definition must contain at least one terminal stage.');
  }

  // Reachability check using BFS
  const visited = new Set<string>();
  const queue = [def.initial];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const s = def.stages[current];
    if (!s) continue;
    if (s.next && stageKeys.has(s.next)) queue.push(s.next);
    if (s.actions) {
      for (const target of Object.values(s.actions)) {
        if (stageKeys.has(target)) queue.push(target);
      }
    }
  }

  for (const key of stageKeys) {
    if (!visited.has(key)) {
      errors.push(`Stage "${key}" is unreachable from the initial stage "${def.initial}".`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

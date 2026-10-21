import { ActorType, Role } from '@pravah/shared';
import { WorkflowStageDefinition } from '@pravah/shared';

export interface GuardActor {
  type: ActorType;
  id?: string;
  role?: Role;
  regionId?: string | null;
}

export interface GuardStepUp {
  totpCode?: string;
  totpVerified?: boolean;
  remarks?: string;
}

export interface GuardEvaluation {
  allowed: boolean;
  isStatutory: boolean;
  reason?: string;
}

export function evaluateStatutoryGuard(
  stage: WorkflowStageDefinition,
  actionName: string,
  actor: GuardActor,
  applicationRegionId?: string | null,
  stepUp?: GuardStepUp
): GuardEvaluation {
  // Check if stage is statutory or if action represents a statutory approval/rejection/sanction
  const isStatutoryAction = stage.statutory === true || 
    ['APPROVE', 'APPROVE_WITH_UNDERTAKING', 'REJECT', 'ISSUE_SHOW_CAUSE', 'CLOSE_UNDERTAKING_AS_BREACHED'].includes(actionName);

  if (!isStatutoryAction) {
    // Non-statutory action check
    if (stage.roles && stage.roles.length > 0) {
      if (!actor.role || !stage.roles.includes(actor.role)) {
        return {
          allowed: false,
          isStatutory: false,
          reason: `Actor role ${actor.role || 'NONE'} is not authorized for stage action ${actionName}. Required: ${stage.roles.join(', ')}`,
        };
      }
    }
    return { allowed: true, isStatutory: false };
  }

  // Statutory Guard: Rule 1 - SYSTEM actors are strictly forbidden
  if (actor.type === 'SYSTEM') {
    return {
      allowed: false,
      isStatutory: true,
      reason: 'STATUTORY_GUARD_VIOLATION: System actors can never execute statutory decisions (approvals, rejections, or sanctions). Human officer action required.',
    };
  }

  // Statutory Guard: Rule 2 - Actor must have an authorized role
  if (!actor.role || (stage.roles && !stage.roles.includes(actor.role))) {
    return {
      allowed: false,
      isStatutory: true,
      reason: `STATUTORY_GUARD_VIOLATION: Role ${actor.role || 'NONE'} is not authorized for statutory action ${actionName}.`,
    };
  }

  // Statutory Guard: Rule 3 - Region scoping (Regional Officers must match application region)
  if (actor.role === 'REGIONAL_OFFICER' && applicationRegionId && actor.regionId !== applicationRegionId) {
    return {
      allowed: false,
      isStatutory: true,
      reason: 'STATUTORY_GUARD_VIOLATION: Regional Officer jurisdiction does not match the application regional office.',
    };
  }

  // Statutory Guard: Rule 4 - Step-up TOTP verification
  if (!stepUp || !stepUp.totpVerified) {
    return {
      allowed: false,
      isStatutory: true,
      reason: 'STATUTORY_GUARD_VIOLATION: Step-up authentication (valid TOTP code) is strictly mandatory for statutory regulatory decisions.',
    };
  }

  // Statutory Guard: Rule 5 - Mandatory remarks
  if (!stepUp.remarks || stepUp.remarks.trim().length < 5) {
    return {
      allowed: false,
      isStatutory: true,
      reason: 'STATUTORY_GUARD_VIOLATION: Statutory decision requires explicit, non-empty remarks for regulatory accountability.',
    };
  }

  return {
    allowed: true,
    isStatutory: true,
  };
}

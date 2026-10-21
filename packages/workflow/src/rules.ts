export interface TrackAssignmentFacts {
  applicationType: string;
  isNewInstitution: boolean;
  intakeDeltaPct?: number;
  hasOpenDeficiency?: boolean;
  previousApprovalYears?: number;
  hasPendingUndertaking?: boolean;
  regionCode?: string;
  programLevel?: string;
}

export interface TrackAssignmentResult {
  trackCode: string;
  ruleFired: string;
  reason: string;
  priority: number;
}

export function assignWorkflowTrack(facts: TrackAssignmentFacts): TrackAssignmentResult {
  // Rule 1: New Institution
  if (facts.isNewInstitution || facts.applicationType === 'NEW_INSTITUTION') {
    return {
      trackCode: 'SCRUTINY_PLUS_EVC',
      ruleFired: 'RULE_NEW_INSTITUTION_MANDATORY_EVC',
      reason: 'New technical institutions require Document Scrutiny followed by mandatory Expert Visit Committee (EVC) verification under APH Chapter I.',
      priority: 100,
    };
  }

  // Rule 2: Major Increase in Intake or New Program
  if (
    facts.applicationType === 'INCREASE_IN_INTAKE' ||
    facts.applicationType === 'NEW_PROGRAM_OR_LEVEL' ||
    (facts.intakeDeltaPct && facts.intakeDeltaPct >= 50)
  ) {
    return {
      trackCode: 'EVC_PLUS_SAC_SHC',
      ruleFired: 'RULE_INTAKE_EXPANSION_SAC_SHC',
      reason: 'Substantial intake expansion (>=50%) or new program introduction mandates EVC inspection and Standing Appellate Committee (SAC/SHC) evaluation.',
      priority: 90,
    };
  }

  // Rule 3: Complaint / Direct Verification
  if (facts.applicationType === 'CHANGE_OF_SITE' || facts.applicationType === 'CLOSURE') {
    return {
      trackCode: 'ONLY_EVC',
      ruleFired: 'RULE_SITE_CHANGE_DIRECT_EVC',
      reason: 'Change of site / campus closure mandates direct council-constituted physical EVC inspection.',
      priority: 85,
    };
  }

  // Rule 4: Clean EoA
  if (facts.applicationType === 'EXTENSION_OF_APPROVAL') {
    if (facts.hasPendingUndertaking) {
      return {
        trackCode: 'SCRUTINY_PLUS_EVC',
        ruleFired: 'RULE_EOA_PENDING_UNDERTAKING_EVC',
        reason: 'Existing institution has unresolved conditional undertakings; requires Scrutiny and EVC physical verification.',
        priority: 75,
      };
    }
    return {
      trackCode: 'ONLY_SCRUTINY',
      ruleFired: 'RULE_CLEAN_EOA_ONLY_SCRUTINY',
      reason: 'Existing technical institution with clean regulatory track record and zero open undertakings qualifies for streamlined Only Scrutiny approval track.',
      priority: 80,
    };
  }

  // Fallback
  return {
    trackCode: 'ONLY_SCRUTINY',
    ruleFired: 'RULE_DEFAULT_FALLBACK',
    reason: 'Standard APH scrutiny approval track assigned by baseline policy rules.',
    priority: 10,
  };
}

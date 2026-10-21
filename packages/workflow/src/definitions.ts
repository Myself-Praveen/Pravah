import { WorkflowJsonDefinition } from '@pravah/shared';

export const SCRUTINY_PLUS_EVC_DEFINITION: WorkflowJsonDefinition = {
  code: 'SCRUTINY_PLUS_EVC',
  version: 1,
  academicYear: '2026-27',
  effectiveFrom: '2026-11-01',
  name: 'Scrutiny followed by Expert Visit Committee (EVC)',
  initial: 'SUBMITTED',
  stages: {
    SUBMITTED: {
      kind: 'auto',
      next: 'SCRUTINY',
    },
    SCRUTINY: {
      kind: 'human',
      roles: ['SCRUTINY_OFFICER'],
      slaWorkingDays: 7,
      actions: {
        CLEAR: 'EVC_QUEUE',
        REVERT: 'DEFICIENCY_REVERTED',
        RECOMMEND_REJECT: 'COMPETENT_AUTHORITY_REVIEW',
      },
    },
    DEFICIENCY_REVERTED: {
      kind: 'institution',
      responseWorkingDays: 10,
      pausesOfficerSla: true,
      actions: {
        RESUBMIT: 'RE_SCRUTINY',
      },
      onTimeout: 'ESCALATE_TO_RO',
    },
    RE_SCRUTINY: {
      kind: 'human',
      roles: ['SCRUTINY_OFFICER'],
      slaWorkingDays: 5,
      actions: {
        CLEAR: 'EVC_QUEUE',
        REVERT: 'DEFICIENCY_REVERTED',
        RECOMMEND_REJECT: 'COMPETENT_AUTHORITY_REVIEW',
      },
    },
    EVC_QUEUE: {
      kind: 'queue',
      slaWorkingDays: 5,
      onEnter: ['CREATE_EVC_SCHEDULE'],
      actions: {
        SCHEDULE: 'EVC_SCHEDULED',
      },
    },
    EVC_SCHEDULED: {
      kind: 'human',
      roles: ['EVC_MEMBER'],
      slaWorkingDays: 15,
      actions: {
        SUBMIT_REPORT: 'COMPETENT_AUTHORITY_REVIEW',
        RESCHEDULE: 'EVC_SCHEDULED',
      },
    },
    COMPETENT_AUTHORITY_REVIEW: {
      kind: 'human',
      statutory: true,
      roles: ['REGIONAL_OFFICER', 'BUREAU_HEAD'],
      slaWorkingDays: 5,
      actions: {
        APPROVE: 'APPROVED_FINAL',
        APPROVE_WITH_UNDERTAKING: 'APPROVED_WITH_UNDERTAKING',
        REJECT: 'REJECTED',
      },
    },
    APPROVED_WITH_UNDERTAKING: {
      kind: 'terminal',
      onEnter: ['CREATE_UNDERTAKING_RECORDS', 'ISSUE_APPROVAL_DRAFT'],
    },
    APPROVED_FINAL: {
      kind: 'terminal',
      onEnter: ['ISSUE_APPROVAL_DRAFT', 'SCHEDULE_DOC_WATCHERS'],
    },
    REJECTED: {
      kind: 'terminal',
    },
  },
};

export const ONLY_SCRUTINY_DEFINITION: WorkflowJsonDefinition = {
  code: 'ONLY_SCRUTINY',
  version: 1,
  academicYear: '2026-27',
  effectiveFrom: '2026-11-01',
  name: 'Standard Extension of Approval (EoA) - Only Scrutiny',
  initial: 'SUBMITTED',
  stages: {
    SUBMITTED: {
      kind: 'auto',
      next: 'SCRUTINY',
    },
    SCRUTINY: {
      kind: 'human',
      roles: ['SCRUTINY_OFFICER'],
      slaWorkingDays: 7,
      actions: {
        CLEAR: 'COMPETENT_AUTHORITY_REVIEW',
        REVERT: 'DEFICIENCY_REVERTED',
      },
    },
    DEFICIENCY_REVERTED: {
      kind: 'institution',
      responseWorkingDays: 10,
      pausesOfficerSla: true,
      actions: {
        RESUBMIT: 'RE_SCRUTINY',
      },
      onTimeout: 'ESCALATE_TO_RO',
    },
    RE_SCRUTINY: {
      kind: 'human',
      roles: ['SCRUTINY_OFFICER'],
      slaWorkingDays: 5,
      actions: {
        CLEAR: 'COMPETENT_AUTHORITY_REVIEW',
        REVERT: 'DEFICIENCY_REVERTED',
      },
    },
    COMPETENT_AUTHORITY_REVIEW: {
      kind: 'human',
      statutory: true,
      roles: ['REGIONAL_OFFICER', 'BUREAU_HEAD'],
      slaWorkingDays: 5,
      actions: {
        APPROVE: 'APPROVED_FINAL',
        APPROVE_WITH_UNDERTAKING: 'APPROVED_WITH_UNDERTAKING',
        REJECT: 'REJECTED',
      },
    },
    APPROVED_WITH_UNDERTAKING: {
      kind: 'terminal',
      onEnter: ['CREATE_UNDERTAKING_RECORDS', 'ISSUE_APPROVAL_DRAFT'],
    },
    APPROVED_FINAL: {
      kind: 'terminal',
      onEnter: ['ISSUE_APPROVAL_DRAFT', 'SCHEDULE_DOC_WATCHERS'],
    },
    REJECTED: {
      kind: 'terminal',
    },
  },
};

export const EVC_PLUS_SAC_SHC_DEFINITION: WorkflowJsonDefinition = {
  code: 'EVC_PLUS_SAC_SHC',
  version: 1,
  academicYear: '2026-27',
  effectiveFrom: '2026-11-01',
  name: 'Expert Visit Committee with Standing Appellate Committee (SAC/SHC)',
  initial: 'SUBMITTED',
  stages: {
    SUBMITTED: {
      kind: 'auto',
      next: 'EVC_QUEUE',
    },
    EVC_QUEUE: {
      kind: 'queue',
      slaWorkingDays: 5,
      onEnter: ['CREATE_EVC_SCHEDULE'],
      actions: {
        SCHEDULE: 'EVC_SCHEDULED',
      },
    },
    EVC_SCHEDULED: {
      kind: 'human',
      roles: ['EVC_MEMBER'],
      slaWorkingDays: 15,
      actions: {
        SUBMIT_REPORT: 'SAC_SHC_REVIEW',
        RESCHEDULE: 'EVC_SCHEDULED',
      },
    },
    SAC_SHC_REVIEW: {
      kind: 'human',
      roles: ['SAC_SHC_MEMBER'],
      slaWorkingDays: 10,
      actions: {
        RECOMMEND_APPROVAL: 'COMPETENT_AUTHORITY_REVIEW',
        RECOMMEND_WITH_UNDERTAKING: 'COMPETENT_AUTHORITY_REVIEW',
        RECOMMEND_REJECT: 'COMPETENT_AUTHORITY_REVIEW',
      },
    },
    COMPETENT_AUTHORITY_REVIEW: {
      kind: 'human',
      statutory: true,
      roles: ['REGIONAL_OFFICER', 'BUREAU_HEAD'],
      slaWorkingDays: 5,
      actions: {
        APPROVE: 'APPROVED_FINAL',
        APPROVE_WITH_UNDERTAKING: 'APPROVED_WITH_UNDERTAKING',
        REJECT: 'REJECTED',
      },
    },
    APPROVED_WITH_UNDERTAKING: {
      kind: 'terminal',
      onEnter: ['CREATE_UNDERTAKING_RECORDS', 'ISSUE_APPROVAL_DRAFT'],
    },
    APPROVED_FINAL: {
      kind: 'terminal',
      onEnter: ['ISSUE_APPROVAL_DRAFT', 'SCHEDULE_DOC_WATCHERS'],
    },
    REJECTED: {
      kind: 'terminal',
    },
  },
};

export const ONLY_EVC_DEFINITION: WorkflowJsonDefinition = {
  code: 'ONLY_EVC',
  version: 1,
  academicYear: '2026-27',
  effectiveFrom: '2026-11-01',
  name: 'Surprise Inspection / Direct EVC Track',
  initial: 'SUBMITTED',
  stages: {
    SUBMITTED: {
      kind: 'auto',
      next: 'EVC_QUEUE',
    },
    EVC_QUEUE: {
      kind: 'queue',
      slaWorkingDays: 3,
      onEnter: ['CREATE_EVC_SCHEDULE'],
      actions: {
        SCHEDULE: 'EVC_SCHEDULED',
      },
    },
    EVC_SCHEDULED: {
      kind: 'human',
      roles: ['EVC_MEMBER'],
      slaWorkingDays: 10,
      actions: {
        SUBMIT_REPORT: 'COMPETENT_AUTHORITY_REVIEW',
        RESCHEDULE: 'EVC_SCHEDULED',
      },
    },
    COMPETENT_AUTHORITY_REVIEW: {
      kind: 'human',
      statutory: true,
      roles: ['REGIONAL_OFFICER', 'BUREAU_HEAD'],
      slaWorkingDays: 5,
      actions: {
        APPROVE: 'APPROVED_FINAL',
        APPROVE_WITH_UNDERTAKING: 'APPROVED_WITH_UNDERTAKING',
        REJECT: 'REJECTED',
      },
    },
    APPROVED_WITH_UNDERTAKING: {
      kind: 'terminal',
      onEnter: ['CREATE_UNDERTAKING_RECORDS'],
    },
    APPROVED_FINAL: {
      kind: 'terminal',
    },
    REJECTED: {
      kind: 'terminal',
    },
  },
};

export const ALL_STANDARD_DEFINITIONS: Record<string, WorkflowJsonDefinition> = {
  SCRUTINY_PLUS_EVC: SCRUTINY_PLUS_EVC_DEFINITION,
  ONLY_SCRUTINY: ONLY_SCRUTINY_DEFINITION,
  EVC_PLUS_SAC_SHC: EVC_PLUS_SAC_SHC_DEFINITION,
  ONLY_EVC: ONLY_EVC_DEFINITION,
};

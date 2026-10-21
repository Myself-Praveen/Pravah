export type Role =
  | 'INSTITUTION_ADMIN'
  | 'SCRUTINY_OFFICER'
  | 'EVC_MEMBER'
  | 'SAC_SHC_MEMBER'
  | 'REGIONAL_OFFICER'
  | 'BUREAU_OFFICER'
  | 'BUREAU_HEAD'
  | 'AUDITOR'
  | 'SYSTEM_ADMIN';

export type ActorType = 'USER' | 'SYSTEM';

export type ApplicationType =
  | 'NEW_INSTITUTION'
  | 'EXTENSION_OF_APPROVAL'
  | 'INCREASE_IN_INTAKE'
  | 'NEW_COURSE'
  | 'NEW_PROGRAM_OR_LEVEL'
  | 'CHANGE_OF_SITE'
  | 'CLOSURE'
  | 'OTHER';

export type ApplicationStatus =
  | 'IN_PROGRESS'
  | 'WITH_INSTITUTION'
  | 'APPROVED'
  | 'APPROVED_WITH_UNDERTAKING'
  | 'REJECTED'
  | 'WITHDRAWN';

export type SlaState = 'GREEN' | 'AMBER' | 'RED' | 'CRITICAL' | 'PAUSED';

export type EvcMode = 'PHYSICAL' | 'ONLINE' | 'HYBRID';

export type EvcStatus = 'QUEUED' | 'SCHEDULED' | 'COMPLETED' | 'OVERDUE_ESCALATED' | 'CANCELLED';

export type ComplianceStatus =
  | 'PENDING_SUBMISSION'
  | 'SUBMITTED_UNDER_REVIEW'
  | 'VERIFIED_COMPLIANT'
  | 'DEFICIENT_REVERTED'
  | 'OVERDUE_ESCALATED'
  | 'BREACHED_ESCALATED'
  | 'EXTENSION_REQUESTED'
  | 'CLOSED';

export type DocStatus = 'VALID' | 'EXPIRING' | 'EXPIRED' | 'RENEWAL_SUBMITTED' | 'RENEWED';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ' | 'DEAD_LETTER';

export type SignatureMethod = 'TOTP_STEP_UP' | 'ESIGN' | 'DSC';

export type ScanStatus = 'PENDING' | 'CLEAN' | 'INFECTED' | 'FAILED';

export type SummaryStatus = 'DRAFT' | 'FINALISED';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  regionId?: string | null;
  institutionId?: string | null;
  preferredLang: string;
}

export interface WorkflowStageDefinition {
  kind: 'auto' | 'human' | 'institution' | 'queue' | 'terminal';
  roles?: Role[];
  slaWorkingDays?: number;
  responseWorkingDays?: number;
  pausesOfficerSla?: boolean;
  statutory?: boolean;
  next?: string;
  actions?: Record<string, string>;
  onEnter?: string[];
  onTimeout?: string;
}

export interface WorkflowJsonDefinition {
  code: string;
  version: number;
  academicYear: string;
  effectiveFrom: string;
  name?: string;
  initial: string;
  stages: Record<string, WorkflowStageDefinition>;
}

export interface AuditVerificationResult {
  streamKey: string;
  isValid: boolean;
  totalEntries: number;
  brokenSeq?: number;
  expectedHash?: string;
  actualHash?: string;
  verifiedAt: string;
}

export interface ProofPanelMetrics {
  totalApplications: number;
  slaAdherenceRate: number;
  missedDeadlinesCount: number;
  duplicateAlertsCount: number;
  avgAlertLagSeconds: number;
  auditChainIntegrity: boolean;
  manualFollowUpsAvoided: number;
  ocrOverrideRate: number;
  activeEscalations: {
    level0: number;
    level1: number;
    level2: number;
  };
  sweeperHealth: {
    lastRunAt: string;
    isSweeperActive: boolean;
    catchUpEventsHandled: number;
  };
}

import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const StepUpAuthSchema = z.object({
  totpCode: z.string().length(6, 'TOTP code must be 6 digits'),
  remarks: z.string().min(5, 'Mandatory statutory remarks required (min 5 characters)'),
});

export const WorkflowTransitionSchema = z.object({
  action: z.string(),
  reasonCode: z.string().optional(),
  remarks: z.string().optional(),
  stepUp: StepUpAuthSchema.optional(),
  payload: z.record(z.any()).optional(),
});

export const DeficiencyRevertSchema = z.object({
  reasonCode: z.string().min(1, 'Reason code is required'),
  remarks: z.string().min(10, 'Specific deficiency instructions required for institution'),
  items: z.array(z.object({
    description: z.string().min(5),
  })).min(1, 'At least one deficiency checklist item must be provided'),
});

export const DeficiencyResponseSchema = z.object({
  deficiencyId: z.string().uuid(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    resolved: z.boolean(),
    responseRemarks: z.string().optional(),
    fileVersionId: z.string().uuid().optional(),
  })),
});

export const ScheduleEvcSchema = z.object({
  applicationId: z.string().uuid(),
  mode: z.enum(['PHYSICAL', 'ONLINE', 'HYBRID']),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  memberIds: z.array(z.string().uuid()).min(2, 'At least 2 committee members required (Lead + Member)'),
  leadMemberId: z.string().uuid(),
  remarks: z.string().optional(),
});

export const RescheduleEvcSchema = z.object({
  evcScheduleId: z.string().uuid(),
  reasonCode: z.string().min(1, 'Reschedule reason code required'),
  remarks: z.string().min(10, 'Mandatory detailed reschedule justification required'),
  newStart: z.string().datetime(),
  newEnd: z.string().datetime(),
});

export const EvcReportSubmitSchema = z.object({
  evcScheduleId: z.string().uuid(),
  recommendation: z.enum(['RECOMMENDED', 'RECOMMENDED_WITH_UNDERTAKING', 'NOT_RECOMMENDED']),
  score: z.number().min(0).max(100),
  observations: z.string().min(20, 'Detailed inspection committee observations required'),
  conditions: z.array(z.object({
    conditionCode: z.string(),
    conditionTitle: z.string(),
    description: z.string(),
    dueDate: z.string().datetime(),
  })).optional(),
});

export const VerifyUndertakingSchema = z.object({
  undertakingId: z.string().uuid(),
  status: z.enum(['VERIFIED_COMPLIANT', 'DEFICIENT_REVERTED', 'BREACHED_ESCALATED']),
  remarks: z.string().min(5),
  stepUp: StepUpAuthSchema.optional(),
});

export const ConfirmDocumentExtractionSchema = z.object({
  documentId: z.string().uuid(),
  docTypeCode: z.string(),
  documentNumber: z.string().min(1),
  issuingAuthority: z.string().optional(),
  issueDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  overriddenFields: z.array(z.string()).default([]),
});

export const AdvanceTimeSchema = z.object({
  days: z.number().int().min(1).max(365),
});

export const AcknowledgeEscalationSchema = z.object({
  escalationId: z.string(),
  remarks: z.string().min(5, 'Action remarks mandatory on escalation acknowledgement'),
});

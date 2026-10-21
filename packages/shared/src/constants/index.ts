// AICTE Regional Offices
export const AICTE_REGIONS = [
  { code: 'SRO', name: 'Southern Regional Office (Chennai)', states: ['Tamil Nadu', 'Puducherry', 'Andaman and Nicobar'] },
  { code: 'SWRO', name: 'South Western Regional Office (Bengaluru)', states: ['Karnataka', 'Kerala', 'Lakshadweep'] },
  { code: 'SCRO', name: 'South Central Regional Office (Hyderabad)', states: ['Andhra Pradesh', 'Telangana'] },
  { code: 'WRO', name: 'Western Regional Office (Mumbai)', states: ['Maharashtra', 'Goa', 'Daman and Diu', 'Dadra and Nagar Haveli'] },
  { code: 'CRO', name: 'Central Regional Office (Bhopal)', states: ['Madhya Pradesh', 'Chhattisgarh', 'Gujarat'] },
  { code: 'NRO', name: 'Northern Regional Office (Kanpur)', states: ['Uttar Pradesh', 'Uttarakhand'] },
  { code: 'NWRO', name: 'North Western Regional Office (Chandigarh)', states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 'Rajasthan', 'Delhi'] },
  { code: 'ERO', name: 'Eastern Regional Office (Kolkata)', states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'] },
  { code: 'NERO', name: 'North Eastern Regional Office (Guwahati)', states: ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'] },
] as const;

// Default SLA thresholds
export const SLA_THRESHOLDS = {
  WARN_PERCENT: 75,
  BREACH_PERCENT: 100,
  CRITICAL_PERCENT: 125,
} as const;

// Document Types configuration
export const DOC_TYPES = [
  {
    code: 'LEASE_DEED',
    label: 'Registered Lease Deed / Land Ownership Title',
    hasExpiry: true,
    minValidityYears: 30,
    reminderOffsets: [90, 60, 30, 15, 7],
    requiredAtStages: ['SCRUTINY', 'COMPETENT_AUTHORITY_REVIEW'],
  },
  {
    code: 'FIRE_SAFETY',
    label: 'Fire Safety Certificate / NOC',
    hasExpiry: true,
    minValidityYears: 1,
    reminderOffsets: [60, 30, 15, 7],
    requiredAtStages: ['SCRUTINY', 'EVC_SCHEDULED'],
  },
  {
    code: 'OCCUPANCY_CERT',
    label: 'Building Completion / Occupancy Certificate',
    hasExpiry: false,
    minValidityYears: null,
    reminderOffsets: [],
    requiredAtStages: ['SCRUTINY'],
  },
  {
    code: 'FDR_BG',
    label: 'Fixed Deposit Receipt / Bank Guarantee for Corpus Fund',
    hasExpiry: true,
    minValidityYears: 8,
    reminderOffsets: [90, 60, 30, 15],
    requiredAtStages: ['SCRUTINY', 'COMPETENT_AUTHORITY_REVIEW'],
  },
] as const;

// Undertaking Condition Library
export const UNDERTAKING_LIBRARY = [
  {
    code: 'FACULTY_RECRUITMENT',
    title: 'Recruitment & cadre ratio compliance of eligible faculty',
    description: 'Institution must recruit requisite qualified faculty with AICTE scale and upload roster within prescribed window.',
    defaultDurationDays: 90,
  },
  {
    code: 'BARRIER_FREE_ENV',
    title: 'Barrier-Free Environment and Divyangjan accessibility certification',
    description: 'Ramps, lifts, special washrooms, and signage compliant with RPwD Act must be completed and certified.',
    defaultDurationDays: 60,
  },
  {
    code: 'FIRE_SAFETY_RENEWAL',
    title: 'Fire Safety NOC Renewal from competent state authority',
    description: 'Updated fire safety compliance inspection report and NOC submission.',
    defaultDurationDays: 45,
  },
  {
    code: 'ANTI_RAGGING_CELL',
    title: 'Anti-Ragging Committee & squad constitution with web undertaking',
    description: 'Submission of affidavits and student undertaking registration on antiragging.in.',
    defaultDurationDays: 30,
  },
  {
    code: 'MANDATORY_DISCLOSURE',
    title: 'Display of Information on institutional website',
    description: 'Full mandatory disclosure portal section updated with faculty, fee structure, and AICTE approval letters.',
    defaultDurationDays: 15,
  },
] as const;

// Standard Reason Codes
export const REASON_CODES = [
  { code: 'DEF_LAND_TITLE_UNCLEAR', category: 'DEFICIENCY', label: 'Land registration deed lacks clear survey number or demarcated boundary' },
  { code: 'DEF_FACULTY_SHORTFALL', category: 'DEFICIENCY', label: 'Cadre ratio deficient: Professor / Associate Professor vacancies exceed allowable limits' },
  { code: 'DEF_LAB_EQUIPMENT_MISSING', category: 'DEFICIENCY', label: 'Prescribed syllabus experimental setups not installed or calibrated' },
  { code: 'DEF_BUILT_UP_AREA_DEFICIENT', category: 'DEFICIENCY', label: 'Instructional / Administrative carpet area less than APH prescribed norms' },
  { code: 'RESCHED_WEATHER_FORCE_MAJEURE', category: 'RESCHEDULE', label: 'Severe weather / travel disruption prevented physical committee inspection' },
  { code: 'RESCHED_MEMBER_MEDICAL', category: 'RESCHEDULE', label: 'Committee member medical emergency; alternate expert empanelment required' },
  { code: 'EXT_GOVT_NOC_PENDING', category: 'EXTENSION', label: 'State Government / Affiliating University NOC processing delayed beyond institution control' },
] as const;

// Event Catalogue
export const EVENT_CATALOGUE = {
  APPLICATION_CREATED: 'application.created',
  APPLICATION_STAGE_CHANGED: 'application.stage_changed',
  APPLICATION_REVERTED: 'application.reverted',
  APPLICATION_RESUBMITTED: 'application.resubmitted',
  APPLICATION_APPROVED: 'application.approved',
  APPLICATION_APPROVED_WITH_UNDERTAKING: 'application.approved_with_undertaking',
  APPLICATION_REJECTED: 'application.rejected',
  SLA_WARNING_LEVEL0: 'sla.warning_level0',
  SLA_ESCALATED_LEVEL1: 'sla.escalated_level1',
  SLA_ESCALATED_LEVEL2: 'sla.escalated_level2',
  EVC_QUEUED: 'evc.queued',
  EVC_SCHEDULED: 'evc.scheduled',
  EVC_REPORT_DUE: 'evc.report_due',
  EVC_REPORT_SUBMITTED: 'evc.report_submitted',
  UNDERTAKING_CREATED: 'undertaking.created',
  UNDERTAKING_REMINDER: 'undertaking.reminder',
  UNDERTAKING_BREACHED: 'undertaking.breached',
  DOCUMENT_EXPIRING_SOON: 'document.expiring_soon',
  DOCUMENT_EXPIRED: 'document.expired',
  DOCUMENT_RENEWED: 'document.renewed',
  ESCALATION_ACKNOWLEDGED: 'escalation.acknowledged',
} as const;

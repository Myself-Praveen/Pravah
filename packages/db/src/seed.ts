import 'dotenv/config';
import { PrismaClient, Role, ApplicationType, ApplicationStatus, SlaState, EvcMode, EvcStatus, ComplianceStatus, DocStatus, NotificationChannel } from '@prisma/client';
import crypto from 'crypto';
import { AICTE_REGIONS, DOC_TYPES, REASON_CODES, UNDERTAKING_LIBRARY } from '@pravah/shared';
import { ALL_STANDARD_DEFINITIONS } from '@pravah/workflow';

const prisma = new PrismaClient();

function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export async function seed() {
  console.log('--- Starting PRAVAH-AICTE Deterministic Seeding ---');

  // 1. System Clock
  await prisma.systemClock.upsert({
    where: { id: 1 },
    update: { offsetSeconds: 0, demoMode: true },
    create: { id: 1, offsetSeconds: 0, demoMode: true },
  });

  // 2. Regions
  const regionsMap: Record<string, string> = {};
  for (const r of AICTE_REGIONS) {
    const region = await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: { code: r.code, name: r.name },
    });
    regionsMap[r.code] = region.id;
  }
  console.log(`Seeded ${Object.keys(regionsMap).length} AICTE Regional Offices.`);

  // 3. Holiday Calendar
  const holidays = [
    { date: new Date('2026-01-26'), label: 'Republic Day', regionId: null },
    { date: new Date('2026-08-15'), label: 'Independence Day', regionId: null },
    { date: new Date('2026-10-02'), label: 'Mahatma Gandhi Jayanti', regionId: null },
    { date: new Date('2026-11-08'), label: 'Diwali', regionId: null },
    { date: new Date('2026-12-25'), label: 'Christmas', regionId: null },
    { date: new Date('2026-04-14'), label: 'Tamil New Year', regionId: regionsMap['SRO'] },
    { date: new Date('2026-11-01'), label: 'Kannada Rajyotsava', regionId: regionsMap['SWRO'] },
  ];
  for (const h of holidays) {
    const existing = await prisma.holidayCalendar.findFirst({
      where: { date: h.date, regionId: h.regionId ?? null },
    });
    if (existing) {
      await prisma.holidayCalendar.update({
        where: { id: existing.id },
        data: { label: h.label },
      });
    } else {
      await prisma.holidayCalendar.create({
        data: { date: h.date, label: h.label, regionId: h.regionId },
      });
    }
  }

  // 4. Document Types
  for (const dt of DOC_TYPES) {
    await prisma.docType.upsert({
      where: { code: dt.code },
      update: {
        label: dt.label,
        hasExpiry: dt.hasExpiry,
        minValidityYears: dt.minValidityYears,
        reminderOffsets: dt.reminderOffsets as number[],
        requiredAtStages: dt.requiredAtStages as string[],
      },
      create: {
        code: dt.code,
        label: dt.label,
        hasExpiry: dt.hasExpiry,
        minValidityYears: dt.minValidityYears,
        reminderOffsets: dt.reminderOffsets as number[],
        requiredAtStages: dt.requiredAtStages as string[],
      },
    });
  }

  // 5. Reason Codes
  for (const rc of REASON_CODES) {
    await prisma.reasonCode.upsert({
      where: { code: rc.code },
      update: { label: rc.label, category: rc.category },
      create: { code: rc.code, label: rc.label, category: rc.category },
    });
  }

  // 6. Workflow Definitions
  const workflowDefMap: Record<string, string> = {};
  for (const [code, def] of Object.entries(ALL_STANDARD_DEFINITIONS)) {
    const wf = await prisma.workflowDefinition.upsert({
      where: { code_version: { code, version: def.version } },
      update: {
        academicYear: def.academicYear,
        name: def.name || code,
        definition: def as any,
        isActive: true,
        effectiveFrom: new Date(def.effectiveFrom),
      },
      create: {
        code,
        version: def.version,
        academicYear: def.academicYear,
        name: def.name || code,
        definition: def as any,
        isActive: true,
        effectiveFrom: new Date(def.effectiveFrom),
        createdById: 'system-seed',
      },
    });
    workflowDefMap[code] = wf.id;

    // SLA Policies
    for (const [stageKey, stageVal] of Object.entries(def.stages)) {
      if (stageVal.slaWorkingDays) {
        await prisma.slaPolicy.upsert({
          where: {
            workflowDefinitionId_stageKey_applicationType: {
              workflowDefinitionId: wf.id,
              stageKey,
              applicationType: 'EXTENSION_OF_APPROVAL',
            },
          },
          update: { durationWorkingDays: stageVal.slaWorkingDays },
          create: {
            workflowDefinitionId: wf.id,
            stageKey,
            applicationType: 'EXTENSION_OF_APPROVAL',
            durationWorkingDays: stageVal.slaWorkingDays,
            warnPct: 75,
            breachPct: 100,
            criticalPct: 125,
          },
        });
      }
    }
  }

  // 7. Escalation Rules
  const escRules = [
    { scope: 'APPLICATION_STAGE', level: 0, triggerType: 'PCT_OF_SLA', triggerValue: 75, targetRole: Role.SCRUTINY_OFFICER, channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL], templateCode: 'SLA_WARN_75' },
    { scope: 'APPLICATION_STAGE', level: 1, triggerType: 'PCT_OF_SLA', triggerValue: 100, targetRole: Role.REGIONAL_OFFICER, channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.SMS], templateCode: 'SLA_BREACH_100' },
    { scope: 'APPLICATION_STAGE', level: 2, triggerType: 'PCT_OF_SLA', triggerValue: 125, targetRole: Role.BUREAU_HEAD, channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.SMS], templateCode: 'SLA_CRITICAL_125' },
    { scope: 'UNDERTAKING', level: 1, triggerType: 'DAYS_AFTER_DUE', triggerValue: 1, targetRole: Role.REGIONAL_OFFICER, channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL], templateCode: 'UNDERTAKING_OVERDUE' },
    { scope: 'DOCUMENT', level: 1, triggerType: 'DAYS_BEFORE_DUE', triggerValue: 30, targetRole: Role.INSTITUTION_ADMIN, channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL], templateCode: 'DOC_EXPIRY_30D' },
  ];
  for (const er of escRules) {
    await prisma.escalationRule.upsert({
      where: {
        scope_level_triggerType_triggerValue: {
          scope: er.scope,
          level: er.level,
          triggerType: er.triggerType,
          triggerValue: er.triggerValue,
        },
      },
      update: { targetRole: er.targetRole, channels: er.channels, templateCode: er.templateCode },
      create: er,
    });
  }

  // 8. Notification Templates (EN + HI)
  const templates = [
    { code: 'SLA_WARN_75', channel: NotificationChannel.IN_APP, lang: 'en', subject: 'Stage SLA Notice: 75% elapsed', body: 'Application {{applicationNumber}} has consumed 75% of stage SLA window.' },
    { code: 'SLA_WARN_75', channel: NotificationChannel.IN_APP, lang: 'hi', subject: 'चरण एसएलए सूचना: 75% समय समाप्त', body: 'आवेदन {{applicationNumber}} के चरण समय का 75% समाप्त हो चुका है।' },
    { code: 'SLA_BREACH_100', channel: NotificationChannel.IN_APP, lang: 'en', subject: 'SLA Escalation Level 1 (RO)', body: 'Application {{applicationNumber}} has breached 100% SLA deadline in stage {{stage}}.' },
    { code: 'SLA_CRITICAL_125', channel: NotificationChannel.IN_APP, lang: 'en', subject: 'CRITICAL Escalation Level 2 (Bureau Head)', body: 'Application {{applicationNumber}} is in CRITICAL state (>=125% SLA).' },
    { code: 'UNDERTAKING_OVERDUE', channel: NotificationChannel.IN_APP, lang: 'en', subject: 'Conditional Undertaking Breached', body: 'Undertaking for {{conditionTitle}} is overdue. Placed in show-cause queue.' },
    { code: 'DEFICIENCY_NOTICE', channel: NotificationChannel.IN_APP, lang: 'en', subject: 'Deficiency Revert Notice', body: 'Scrutiny officer has reverted application {{applicationNumber}} with checklist items.' },
  ];
  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: { code_channel_lang: { code: t.code, channel: t.channel, lang: t.lang } },
      update: { subject: t.subject, body: t.body },
      create: t,
    });
  }

  // 9. Users
  // Password hash for 'Demo@123'
  const defaultPasswordHash = '$2a$10$wK1VqYvK6Qn1p9Akm7f5wOQJ7J.K389hJ3K.xL0tBw4uH2Yp5b6k2'; // Demo@123

  const usersData = [
    { id: 'usr-hq-head', email: 'hq.head@aicte.gov.in', name: 'Dr. Ramesh Sharma', role: Role.BUREAU_HEAD, designation: 'Advisor / Bureau Head', regionId: null },
    { id: 'usr-hq-officer', email: 'hq.officer@aicte.gov.in', name: 'Sunil Verma', role: Role.BUREAU_OFFICER, designation: 'Director, Regulation Bureau', regionId: null },
    { id: 'usr-ro-south', email: 'ro.south@aicte.gov.in', name: 'K. Balasubramanian', role: Role.REGIONAL_OFFICER, designation: 'Regional Officer (SRO)', regionId: regionsMap['SRO'] },
    { id: 'usr-ro-west', email: 'ro.west@aicte.gov.in', name: 'Dr. Anand Joshi', role: Role.REGIONAL_OFFICER, designation: 'Regional Officer (WRO)', regionId: regionsMap['WRO'] },
    { id: 'usr-scrutiny-south1', email: 'scrutiny.south1@aicte.gov.in', name: 'P. Meenakshi', role: Role.SCRUTINY_OFFICER, designation: 'Assistant Director / Scrutiny', regionId: regionsMap['SRO'] },
    { id: 'usr-evc-lead1', email: 'evc.lead1@aicte.gov.in', name: 'Prof. Rajesh Kulkarni', role: Role.EVC_MEMBER, designation: 'EVC Committee Lead', regionId: null },
    { id: 'usr-evc-member2', email: 'evc.member2@aicte.gov.in', name: 'Dr. Aruna Devi', role: Role.EVC_MEMBER, designation: 'EVC Committee Expert', regionId: null },
    { id: 'usr-sacshc-member1', email: 'sacshc.member1@aicte.gov.in', name: 'Hon. Justice (Retd.) M. Rao', role: Role.SAC_SHC_MEMBER, designation: 'SAC/SHC Committee Chair', regionId: null },
    { id: 'usr-admin', email: 'admin@aicte.gov.in', name: 'System Administrator', role: Role.SYSTEM_ADMIN, designation: 'Policy & Workflow Administrator', regionId: null },
    { id: 'usr-auditor', email: 'auditor@aicte.gov.in', name: 'CAG Compliance Officer', role: Role.AUDITOR, designation: 'Statutory Vigilance Auditor', regionId: null },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, designation: u.designation, regionId: u.regionId },
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        designation: u.designation,
        regionId: u.regionId,
        passwordHash: defaultPasswordHash,
        totpSecretEnc: 'MZXW6YTBOJUW4ZY=', // pre-shared TOTP seed
      },
    });
  }

  // 10. Institutions & Story Records (Institutions A through L)
  const stories = [
    {
      key: 'A',
      name: 'Apex Institute of Technology & Engineering',
      permanentId: '1-46273286079',
      state: 'Tamil Nadu',
      regionCode: 'SRO',
      track: 'SCRUTINY_PLUS_EVC',
      appType: ApplicationType.NEW_INSTITUTION,
      stage: 'SCRUTINY',
      slaState: SlaState.GREEN,
      slaPct: 60,
      daysInStage: 4,
      desc: 'Institution A — Scrutiny SLA 60% (Demo Step 2: Revert)',
    },
    {
      key: 'B',
      name: 'Bharath Institute of Advanced Science',
      permanentId: '1-46273286080',
      state: 'Tamil Nadu',
      regionCode: 'SRO',
      track: 'SCRUTINY_PLUS_EVC',
      appType: ApplicationType.NEW_INSTITUTION,
      stage: 'SCRUTINY',
      slaState: SlaState.GREEN,
      slaPct: 35,
      daysInStage: 2,
      desc: 'Institution B — Clean file in scrutiny (Demo Step 2: Clear to EVC)',
    },
    {
      key: 'C',
      name: 'Chennai Polytechnic & Technical Campus',
      permanentId: '1-46273286081',
      state: 'Tamil Nadu',
      regionCode: 'SRO',
      track: 'ONLY_SCRUTINY',
      appType: ApplicationType.EXTENSION_OF_APPROVAL,
      stage: 'SCRUTINY',
      slaState: SlaState.AMBER,
      slaPct: 82,
      daysInStage: 6,
      desc: 'Institution C — EoA Amber 82% SLA',
    },
    {
      key: 'D',
      name: 'Deccan College of Engineering & Research',
      permanentId: '1-46273286082',
      state: 'Karnataka',
      regionCode: 'SWRO',
      track: 'EVC_PLUS_SAC_SHC',
      appType: ApplicationType.INCREASE_IN_INTAKE,
      stage: 'SAC_SHC_REVIEW',
      slaState: SlaState.RED,
      slaPct: 112,
      daysInStage: 11,
      desc: 'Institution D — Intake expansion in SAC/SHC, RED 112% (Level 1 escalation)',
    },
    {
      key: 'E',
      name: 'Eastern Academy of Maritime Studies',
      permanentId: '1-46273286083',
      state: 'West Bengal',
      regionCode: 'ERO',
      track: 'ONLY_EVC',
      appType: ApplicationType.CLOSURE,
      stage: 'EVC_SCHEDULED',
      slaState: SlaState.AMBER,
      slaPct: 85,
      daysInStage: 12,
      desc: 'Institution E — Only EVC scheduled, report due in 2 days',
    },
    {
      key: 'F',
      name: 'Frontier Institute of Pharmaceutical Sciences',
      permanentId: '1-46273286084',
      state: 'Maharashtra',
      regionCode: 'WRO',
      track: 'SCRUTINY_PLUS_EVC',
      appType: ApplicationType.NEW_INSTITUTION,
      stage: 'SCRUTINY',
      slaState: SlaState.CRITICAL,
      slaPct: 131,
      daysInStage: 10,
      desc: 'Institution F — Scrutiny file CRITICAL (131%, Level 2 escalation to Bureau)',
    },
    {
      key: 'G',
      name: 'Greenfield Engineering College',
      permanentId: '1-46273286085',
      state: 'Tamil Nadu',
      regionCode: 'SRO',
      track: 'SCRUTINY_PLUS_EVC',
      appType: ApplicationType.NEW_INSTITUTION,
      stage: 'APPROVED_WITH_UNDERTAKING',
      slaState: SlaState.GREEN,
      slaPct: 50,
      daysInStage: 1,
      desc: 'Institution G — Approved with undertaking due in 5 days (Demo Step 4: Time Travel)',
    },
    {
      key: 'H',
      name: 'Heritage Institute of Architecture',
      permanentId: '1-46273286086',
      state: 'Uttar Pradesh',
      regionCode: 'NRO',
      track: 'ONLY_SCRUTINY',
      appType: ApplicationType.EXTENSION_OF_APPROVAL,
      stage: 'APPROVED_WITH_UNDERTAKING',
      slaState: SlaState.RED,
      slaPct: 120,
      daysInStage: 1,
      desc: 'Institution H — Barrier-free undertaking overdue 6 days (Breach path)',
    },
    {
      key: 'I',
      name: 'Indus Valley College of Management & Tech',
      permanentId: '1-46273286087',
      state: 'Maharashtra',
      regionCode: 'WRO',
      track: 'ONLY_SCRUTINY',
      appType: ApplicationType.EXTENSION_OF_APPROVAL,
      stage: 'SCRUTINY',
      slaState: SlaState.GREEN,
      slaPct: 40,
      daysInStage: 3,
      desc: 'Institution I — Lease expiring in 28 days (Demo Step 5: Smart Renewal)',
    },
    {
      key: 'J',
      name: 'Jupiter College of Engineering & Tech',
      permanentId: '1-46273286088',
      state: 'Karnataka',
      regionCode: 'SWRO',
      track: 'ONLY_SCRUTINY',
      appType: ApplicationType.EXTENSION_OF_APPROVAL,
      stage: 'SCRUTINY',
      slaState: SlaState.RED,
      slaPct: 110,
      daysInStage: 8,
      desc: 'Institution J — Lease expired 12 days ago, COMPLIANCE_DEFICIENT',
    },
    {
      key: 'K',
      name: 'Krishna Polytechnic Institute',
      permanentId: '1-46273286089',
      state: 'Andhra Pradesh',
      regionCode: 'SCRO',
      track: 'ONLY_SCRUTINY',
      appType: ApplicationType.EXTENSION_OF_APPROVAL,
      stage: 'APPROVED_FINAL',
      slaState: SlaState.GREEN,
      slaPct: 40,
      daysInStage: 20,
      desc: 'Institution K — Fire-safety renewed late with catch-up alert audit',
    },
    {
      key: 'L',
      name: 'Loyola Technical Campus',
      permanentId: '1-46273286090',
      state: 'Tamil Nadu',
      regionCode: 'SRO',
      track: 'SCRUTINY_PLUS_EVC',
      appType: ApplicationType.NEW_INSTITUTION,
      stage: 'DEFICIENCY_REVERTED',
      slaState: SlaState.PAUSED,
      slaPct: 90,
      daysInStage: 9,
      desc: 'Institution L — Deficiency reverted 9 days ago, near 10-day timeout',
    },
  ];

  const now = new Date();

  for (const s of stories) {
    const regionId = regionsMap[s.regionCode];

    // Institution
    const inst = await prisma.institution.upsert({
      where: { aictePermanentId: s.permanentId },
      update: {
        name: s.name,
        state: s.state,
        regionId,
        complianceHealth: s.key === 'J' ? 'COMPLIANCE_DEFICIENT' : 'GOOD',
      },
      create: {
        aictePermanentId: s.permanentId,
        name: s.name,
        state: s.state,
        regionId,
        institutionType: 'Engineering & Technology',
        complianceHealth: s.key === 'J' ? 'COMPLIANCE_DEFICIENT' : 'GOOD',
      },
    });

    // Institution User
    const instEmail = `inst.${s.key.toLowerCase()}@aicte.gov.in`;
    await prisma.user.upsert({
      where: { email: instEmail },
      update: { institutionId: inst.id, regionId },
      create: {
        email: instEmail,
        name: `Principal / Director (${s.name})`,
        role: Role.INSTITUTION_ADMIN,
        institutionId: inst.id,
        regionId,
        passwordHash: defaultPasswordHash,
      },
    });

    // Application
    const appNum = `APH2026-${s.regionCode}-${s.permanentId.slice(-5)}`;
    const stageEnteredAt = new Date(now.getTime() - s.daysInStage * 24 * 3600 * 1000);
    const deadline = new Date(stageEnteredAt.getTime() + 7 * 24 * 3600 * 1000);

    const app = await prisma.application.upsert({
      where: { applicationNumber: appNum },
      update: {
        currentStage: s.stage,
        slaState: s.slaState,
        stageEnteredAt,
        stageSlaDeadline: deadline,
        assignedOfficerId: s.regionCode === 'SRO' ? 'usr-scrutiny-south1' : null,
      },
      create: {
        applicationNumber: appNum,
        institutionId: inst.id,
        regionId,
        academicYear: '2026-27',
        applicationType: s.appType,
        isNewInstitution: s.appType === ApplicationType.NEW_INSTITUTION,
        workflowDefinitionId: workflowDefMap[s.track],
        trackAssignmentReason: `Auto-assigned ${s.track} track based on institutional criteria.`,
        currentStage: s.stage,
        status: s.stage.startsWith('APPROVED') ? ApplicationStatus.APPROVED : s.stage === 'DEFICIENCY_REVERTED' ? ApplicationStatus.WITH_INSTITUTION : ApplicationStatus.IN_PROGRESS,
        stageEnteredAt,
        stageSlaDeadline: deadline,
        slaState: s.slaState,
        assignedOfficerId: s.regionCode === 'SRO' ? 'usr-scrutiny-south1' : null,
      },
    });

    // Undertaking for Institution G (Due in 5 days) & H (Overdue 6 days)
    if (s.key === 'G') {
      const uDueDate = new Date(now.getTime() + 5 * 24 * 3600 * 1000);
      await prisma.undertaking.create({
        data: {
          institutionId: inst.id,
          applicationId: app.id,
          conditionCode: 'FACULTY_RECRUITMENT',
          conditionTitle: 'Recruit and upload faculty details in AICTE cadre ratio',
          description: 'Submission of roster and appointment letters of 12 Assistant Professors and 2 Associate Professors.',
          issuedAt: stageEnteredAt,
          dueDate: uDueDate,
          originalDueDate: uDueDate,
          status: ComplianceStatus.PENDING_SUBMISSION,
          verifierRole: Role.REGIONAL_OFFICER,
          nextAlertAt: new Date(now.getTime() + 2 * 24 * 3600 * 1000),
        },
      });
    }

    if (s.key === 'H') {
      const uDueDate = new Date(now.getTime() - 6 * 24 * 3600 * 1000);
      await prisma.undertaking.create({
        data: {
          institutionId: inst.id,
          applicationId: app.id,
          conditionCode: 'BARRIER_FREE_ENV',
          conditionTitle: 'Barrier-Free Environment & Divyangjan Access Certification',
          description: 'Certification of ramps and specialized restrooms across all administrative and instructional blocks.',
          issuedAt: new Date(now.getTime() - 66 * 24 * 3600 * 1000),
          dueDate: uDueDate,
          originalDueDate: uDueDate,
          status: ComplianceStatus.OVERDUE_ESCALATED,
          escalationLevel: 1,
          verifierRole: Role.REGIONAL_OFFICER,
          nextAlertAt: now,
        },
      });
    }

    // Document for Institution I (Expiring in 28 days) & J (Expired 12 days ago)
    if (s.key === 'I') {
      const expiry = new Date(now.getTime() + 28 * 24 * 3600 * 1000);
      await prisma.trackedDocument.create({
        data: {
          institutionId: inst.id,
          docTypeCode: 'LEASE_DEED',
          documentNumber: 'TN-CH-REG-2016-89412',
          issuingAuthority: 'Sub-Registrar Office, Chennai',
          issueDate: new Date('2016-04-10'),
          expiryDate: expiry,
          status: DocStatus.EXPIRING,
          escalationLevel: 1,
          nextAlertAt: now,
        },
      });
    }

    if (s.key === 'J') {
      const expiry = new Date(now.getTime() - 12 * 24 * 3600 * 1000);
      await prisma.trackedDocument.create({
        data: {
          institutionId: inst.id,
          docTypeCode: 'LEASE_DEED',
          documentNumber: 'KA-BLR-REG-1996-33120',
          issuingAuthority: 'Sub-Registrar Office, Bengaluru North',
          issueDate: new Date('1996-03-15'),
          expiryDate: expiry,
          status: DocStatus.EXPIRED,
          escalationLevel: 2,
          nextAlertAt: now,
        },
      });
    }

    // Genesis Audit Log for this application
    const streamKey = `APP:${app.id}`;
    const genesisInput = `PRAVAH-GENESIS|${streamKey}`;
    const genesisHash = sha256(genesisInput);
    const entryPayload = {
      event: 'APPLICATION_SUBMITTED',
      academicYear: '2026-27',
      assignedTrack: s.track,
      applicationNumber: appNum,
    };
    const payloadHash = sha256(JSON.stringify(entryPayload));
    const entryHash = sha256(JSON.stringify({
      streamKey,
      seq: 1,
      actorType: 'USER',
      actorId: `inst.${s.key.toLowerCase()}@aicte.gov.in`,
      actionType: 'STAGE_TRANSITION',
      entityType: 'Application',
      entityId: app.id,
      previousState: null,
      newState: s.stage,
      payloadHash,
      prevHash: genesisHash,
    }));

    await prisma.auditLog.upsert({
      where: { streamKey_seq: { streamKey, seq: 1 } },
      update: {},
      create: {
        streamKey,
        seq: 1,
        applicationId: app.id,
        actorType: 'USER',
        actorId: `inst.${s.key.toLowerCase()}@aicte.gov.in`,
        actorRole: Role.INSTITUTION_ADMIN,
        actionType: 'STAGE_TRANSITION',
        entityType: 'Application',
        entityId: app.id,
        previousState: 'INTAKE',
        newState: s.stage,
        remarks: 'Institutional submission under APH 2026-27.',
        payload: entryPayload,
        payloadHash,
        prevHash: genesisHash,
        hash: entryHash,
        createdAt: stageEnteredAt,
      },
    });
  }

  console.log(`Seeded 12 story institutions (A to L) with applications, audit chains, and deadlines.`);
  console.log('--- PRAVAH-AICTE Seeding Finished Successfully ---');
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

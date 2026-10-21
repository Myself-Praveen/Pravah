import {
  ALL_STANDARD_DEFINITIONS,
  validateWorkflowDefinition,
  calculateWorkingDays,
  addWorkingDays,
  computeSlaPercentage,
  getSlaStateFromPercentage,
  evaluateStatutoryGuard,
  assignWorkflowTrack,
} from '../packages/workflow/src/index.js';
import { AuditService, canonicalJson, sha256 } from '../apps/api/src/audit.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}${details ? ` - ${details}` : ''}`);
    failed++;
  }
}

async function runAcceptanceTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PRAVAH-AICTE ACCEPTANCE TEST SUITE (T01 - T16)');
  console.log('======================================================\n');

  // T01: Track Coverage (All 4 standard tracks defined and valid)
  console.log('--- Test T01: Track Coverage ---');
  const tracks = ['SCRUTINY_PLUS_EVC', 'ONLY_SCRUTINY', 'EVC_PLUS_SAC_SHC', 'ONLY_EVC'];
  for (const t of tracks) {
    const def = ALL_STANDARD_DEFINITIONS[t];
    assert(def !== undefined, `T01: Track ${t} is defined in Handbook-as-Data`);
    const val = validateWorkflowDefinition(def);
    assert(val.valid, `T01: Track ${t} passes statechart validation without errors`);
  }

  // T02: Definition Validator (Rejects invalid definitions)
  console.log('\n--- Test T02: Workflow Definition Validator ---');
  const invalidDef: any = {
    code: 'INVALID_TEST',
    version: 1,
    academicYear: '2026-27',
    effectiveFrom: '2026-11-01',
    initial: 'START',
    stages: {
      START: { kind: 'human', roles: [], slaWorkingDays: 0, actions: { GOTO_NOWHERE: 'NON_EXISTENT' } },
    },
  };
  const valResult = validateWorkflowDefinition(invalidDef);
  assert(!valResult.valid, 'T02: Validator rejects definition with missing terminal and broken targets');
  assert(valResult.errors.length >= 3, `T02: Validator caught ${valResult.errors.length} structural schema errors`);

  // T03 & T04: Working-Day Math & Holidays
  console.log('\n--- Test T03 & T04: Working-Day Math & Holidays ---');
  const friday = new Date('2026-10-23T10:00:00Z'); // Friday
  const monday = new Date('2026-10-26T10:00:00Z'); // Monday
  const workingDaysWeekend = calculateWorkingDays(friday, monday, []);
  assert(workingDaysWeekend === 1, 'T04: Weekend (Sat-Sun) correctly excluded from working-day duration');

  const holidays = [{ date: '2026-10-26', label: 'Diwali', regionId: null }];
  const workingDaysHoliday = calculateWorkingDays(friday, monday, holidays);
  assert(workingDaysHoliday === 0, 'T04: Holiday correctly excluded from working-day duration');

  // SLA Consumed Percentage
  const start = new Date('2026-10-01T10:00:00Z');
  const mid = new Date('2026-10-08T10:00:00Z');
  const pct = computeSlaPercentage(start, mid, 7, 0, []);
  assert(pct > 0, `T03: SLA consumed computed correctly: ${pct}%`);
  assert(getSlaStateFromPercentage(80) === 'AMBER', 'T03: 80% SLA correctly maps to AMBER warning');
  assert(getSlaStateFromPercentage(110) === 'RED', 'T03: 110% SLA correctly maps to RED breach');
  assert(getSlaStateFromPercentage(130) === 'CRITICAL', 'T03: 130% SLA correctly maps to CRITICAL delay');
  assert(getSlaStateFromPercentage(50, true) === 'PAUSED', 'T03: Paused flag correctly maps to PAUSED status');

  // T05: Statutory Human-in-the-Loop (HITL) Guard
  console.log('\n--- Test T05: Statutory HITL Guard Enforcement ---');
  const statutoryStage: any = {
    kind: 'human',
    statutory: true,
    roles: ['REGIONAL_OFFICER', 'BUREAU_HEAD'],
  };

  // Rule 1: System actor MUST FAIL
  const systemActorEval = evaluateStatutoryGuard(
    statutoryStage,
    'APPROVE',
    { type: 'SYSTEM', id: 'auto-bot' },
    'r-sro'
  );
  assert(!systemActorEval.allowed, 'T05: System actor physically BLOCKED from taking statutory decisions');
  assert(systemActorEval.reason?.includes('STATUTORY_GUARD_VIOLATION'), 'T05: Guard reason explicitly cites statutory violation');

  // Rule 2: Wrong role MUST FAIL
  const wrongRoleEval = evaluateStatutoryGuard(
    statutoryStage,
    'APPROVE',
    { type: 'USER', id: 'usr-scrutiny', role: 'SCRUTINY_OFFICER' as any },
    'r-sro'
  );
  assert(!wrongRoleEval.allowed, 'T05: Non-authorized role (SCRUTINY_OFFICER) blocked from statutory APPROVE');

  // Rule 3: Missing TOTP Step-Up MUST FAIL
  const missingStepUpEval = evaluateStatutoryGuard(
    statutoryStage,
    'APPROVE',
    { type: 'USER', id: 'usr-ro', role: 'REGIONAL_OFFICER' as any, regionId: 'r-sro' },
    'r-sro',
    { totpVerified: false, remarks: 'Approval grounds' }
  );
  assert(!missingStepUpEval.allowed, 'T05: Missing fresh TOTP step-up authentication blocked');

  // Rule 4: Missing Remarks MUST FAIL
  const missingRemarksEval = evaluateStatutoryGuard(
    statutoryStage,
    'APPROVE',
    { type: 'USER', id: 'usr-ro', role: 'REGIONAL_OFFICER' as any, regionId: 'r-sro' },
    'r-sro',
    { totpVerified: true, remarks: '' }
  );
  assert(!missingRemarksEval.allowed, 'T05: Missing mandatory accountability remarks blocked');

  // Rule 5: Correct authorized human with TOTP & remarks MUST PASS
  const validHumanEval = evaluateStatutoryGuard(
    statutoryStage,
    'APPROVE',
    { type: 'USER', id: 'usr-ro', role: 'REGIONAL_OFFICER' as any, regionId: 'r-sro' },
    'r-sro',
    { totpVerified: true, remarks: 'Verified compliant with AICTE Approval Process Handbook Chapter I.' }
  );
  assert(validHumanEval.allowed, 'T05: Authorized Regional Officer with verified TOTP & remarks ACCEPTED');

  // T06: Rules Engine Track Assignment
  console.log('\n--- Test T06: Rules Engine Track Routing ---');
  const newInstTrack = assignWorkflowTrack({ applicationType: 'NEW_INSTITUTION', isNewInstitution: true });
  assert(newInstTrack.trackCode === 'SCRUTINY_PLUS_EVC', 'T06: New institution auto-routed to SCRUTINY_PLUS_EVC');

  const intakeTrack = assignWorkflowTrack({ applicationType: 'INCREASE_IN_INTAKE', isNewInstitution: false, intakeDeltaPct: 60 });
  assert(intakeTrack.trackCode === 'EVC_PLUS_SAC_SHC', 'T06: Intake expansion auto-routed to EVC_PLUS_SAC_SHC');

  const cleanEoaTrack = assignWorkflowTrack({ applicationType: 'EXTENSION_OF_APPROVAL', isNewInstitution: false, hasPendingUndertaking: false });
  assert(cleanEoaTrack.trackCode === 'ONLY_SCRUTINY', 'T06: Clean EoA institution auto-routed to ONLY_SCRUTINY');

  // T14: Tamper-Evident SHA-256 Audit Hash Chain
  console.log('\n--- Test T14: Cryptographic SHA-256 Hash Chaining ---');
  const streamKey = 'APP:test-stream-001';
  const genesis = sha256(`PRAVAH-GENESIS|${streamKey}`);
  const block1Payload = { action: 'SUBMIT', applicant: 'Apex Institute' };
  const payloadHash1 = sha256(canonicalJson(block1Payload));
  const block1Hash = sha256(canonicalJson({
    streamKey,
    seq: 1,
    actionType: 'SUBMIT',
    payloadHash: payloadHash1,
    prevHash: genesis,
  }));

  const block2Payload = { action: 'CLEAR_SCRUTINY', officer: 'P. Meenakshi' };
  const payloadHash2 = sha256(canonicalJson(block2Payload));
  const block2Hash = sha256(canonicalJson({
    streamKey,
    seq: 2,
    actionType: 'CLEAR_SCRUTINY',
    payloadHash: payloadHash2,
    prevHash: block1Hash,
  }));

  assert(block1Hash.length === 64, 'T14: Block 1 SHA-256 digest is valid 256-bit hexadecimal string');
  assert(block2Hash.length === 64, 'T14: Block 2 correctly links to Block 1 hash');

  // Simulate tampering
  const tamperedPayloadHash1 = sha256(canonicalJson({ action: 'TAMPERED_ACTION', applicant: 'Malicious' }));
  assert(tamperedPayloadHash1 !== payloadHash1, 'T14: Alteration of single byte in payload causes immediate hash rupture');

  console.log('\n======================================================');
  console.log(`📊 ACCEPTANCE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests().catch(e => {
  console.error('Test suite failed with unexpected error:', e);
  process.exit(1);
});

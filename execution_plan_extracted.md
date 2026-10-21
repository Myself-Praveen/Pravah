--- PAGE 1 ---
SIH26262 Master Execution & Architecture Plan (plan.md) — v2
Problem Statement ID: SIH26262
Title: Integrated AICTE Approval Workﬂow Automation, Compliance Monitoring and Alert Management System
Organization / Department: AICTE / Regulation Bureau
Category & Theme: Software | Smart Automation
Idea Submission Deadline: 28 October 2026 (the portal showed 8/500 ideas for this PS when last checked — submit the PPT
early, do not wait for the last day)
Solution Name:PRAVAH-AICTE — Platform for Regulatory Approval, Vigilance, Automation & Handbook Compliance
Execution model:One single continuous build. No phases, no phase gates. All workstreams start together, integrate
continuously on one trunk, and ﬁnish together against one Deﬁnition of Done (Section 12).
How to read this document: Sections 1–3 explain what and why (and map every line of the problem statement to a feature and a
test). Sections 4–9 are the technical blueprint (architecture, workﬂow engine, modules, security, schema, APIs). Section 10–11 are
the repo layout and seed data. Section 12 is the single-phase execution plan. Sections 13–14 are the demo script and the PPT
content. Sections 15–16 are risks and acceptance tests. Appendix A lists everything changed from v1.
1. Executive Summary & Vision
AICTE processes applications from technical institutions through multiple stages — scrutiny / re-scrutiny, Expert Visit Committee
(EVC), SAC/SHC and other stages under the Approval Process Handbook (APH) — and issues approvals (EoA for existing
institutions, LoA for new ones), some of them subject to time-bound undertakings (for example, a real 2026-27 SAC/SHC report
recommends "EoA with undertaking for the recruitment" of faculty). Tracking application movement, stage-wise pendency, EVC
scheduling, undertakings, compliance submissions and document/lease validity across multiple Regional Offices and Bureaus is
today a manual, follow-up-heavy exercise.
Our solution: PRAVAH-AICTE is a conﬁgurable, event-driven Regulatory Workﬂow & Compliance Automation Platform with six
integrated modules:
1. A conﬁgurable APH Workﬂow Engine — approval tracks are data (versioned JSON deﬁnitions), not code. Zero-touch stage
routing, authorised revert/return with recorded reasons.
2. An SLA & Pendency Command Center — working-day SLA clocks with pause/resume, ageing heatmaps, bottleneck and
workload analytics, role-based dashboards.
3. An EVC Queue & Scheduler — auto-queueing after scrutiny, mode-aware (Physical / Online / Hybrid) scheduling, conﬂict-of-
interest check, due/overdue tracking.
4. An Undertaking & Compliance Ledger — every conditional approval becomes a tracked record with due dates, evidence
upload, officer veriﬁcation and breach escalation.
5. A Document Validity Monitor with AI-assisted extraction (human-conﬁrmed) of lease/certiﬁcate dates, tiered renewal alerts
and COMPLIANCE_DEFICIENT ﬂagging.
6. A Notiﬁcation, Escalation & Reporting Engine backed by a tamper-evident, hash-chained audit trail and a strict Human-in-
the-Loop (HITL) guard so automation can never take a statutory decision.
Design principles (these are what make it the "best" submission, not just a complete one):
Principle What it means in practice
Handbook-as-data APH tracks, SLA days, thresholds, escalation chains, reminder offsets and document types are all conﬁguration with
versioning and effective dates. When APH changes, no deployment is needed.
Deadlines that cannot
be missed
A deterministic, idempotent sweeper recomputes due actions from the database on every run (and on restart), so a
crashed worker or a day of downtime still results in every alert being sent exactly once.
Automation assists,
humans decide
The state machine physically cannot execute statutory transitions (approve / reject / show-cause) unless the actor is an
authorised human who passed step-up authentication. Enforced in code and covered by tests.
Prove it, don't claim it A live Proof Panel shows alert timeliness, missed-deadline count, audit-chain veriﬁcation and SLA stats — mapped to the
exact evaluation criteria in the problem statement.
Demo-safe by design A virtual clock ("Time Travel") lets judges watch days of deadlines elapse in seconds; one command boots everything; a
reset button restores the seed.

--- PAGE 2 ---
2. Ground Truth: Facts Veriﬁed Against AICTE Sources (and What Must Still Be Veriﬁed)
Several details in v1 were assumptions. The table below corrects them and ﬂags what to conﬁrm in the official APH 2024-25 to 2026-
27 handbook before the ﬁnal demo.
# Fact Evidence / status How the plan handles it
1 AICTE has more than four Regional Offices — public
AICTE documents list Western, Southern, South
Western, South Central, Central, Eastern, North
Western, Northern and North Eastern. Approval
letters carry preﬁxes such as South-West, South-
Central, Southern.
Veriﬁed from AICTE RO
list / RTI page / EoA
letters. Exact current
list: conﬁrm.
Region is a lookup table, not a 4-value enum. Seed with all
nine; map-based HQ view is built from the table.
2 SAC = Standing Appellate Committee (considers
appeals). Real committee reports are titled
"SAC/SHC" with ﬁelds Committee ID, SAC/SHC
Status, Completion Date, EoA/LoA Recommended.
Veriﬁed from AICTE
2026-27 SAC reports
and the Dec-2025
corrigendum. SHC
expansion: conﬁrm in
APH.
Modelled as one committee stage SAC_SHC_REVIEW with
outcomes RECOMMENDED,
RECOMMENDED_WITH_UNDERTAKING, NOT_RECOMMENDED.
Labels are conﬁgurable. v1 wrongly showed 
SHC_Hearing →
SAC_Appeal as two sequential stages.
3 EVC is constituted by the Council (corrigendum
dated 2 Dec 2025, changing "Regional Officer"), and
can be Physical / Online / Hybrid.
Veriﬁed (TeamLease
RegTech summary of
the corrigendum).
EvcSchedule.mode, constitutedBy; the RO's role is
queue visibility + escalation recipient, not committee
constitution. Conﬁg ﬂag allows either model.
4 Approvals can be with undertaking (e.g. faculty
recruitment).
Veriﬁed from a 2026-27
SAC/SHC report.
Undertaking ledger seeded with this exact real-world case
type.
5 Permanent institution ID format looks like 
 1-
46273286079; EoA numbering like 
South-
West/1-46287070878/2026/EOA.
Seen on public EoA
letters.
Seed data and validators use this format.
6 Applications are submitted through the AICTE web
portal (and the 2026-27 notice references NSWS).
Public notice. Conﬁrm
current integration
surfaces.
Integration is via an adapter layer (Section 7.6) — mocked in
the demo, replaceable in production.
7 Exact stage SLA durations, EVC completion
windows, undertaking periods, lease validity norms
(e.g. "30-year registered lease")
Not veriﬁed — pull from
APH.
All durations are conﬁguration with clearly marked
PLACEHOLDER seed values. Never present placeholders to
judges as official numbers; say "conﬁgured from APH".
8 Full list of tracked document types (lease deed, ﬁre
safety, building completion/occupancy, FDR/bank
guarantee, etc.)
Partly from PS wording
("lease documents and
other prescribed
documents"). Conﬁrm
list.
DocType is a conﬁgurable table with per-type validity rules
and reminder offsets.
Rule for the team: anything in a PPT slide or the demo that states an official number (days, years, thresholds) must be traceable to
an APH clause. Otherwise label it "conﬁgurable — set per APH".
3. Requirement Traceability Matrix (PS → Feature → Demo Proof → Test)
Evaluators score against the problem statement. This matrix guarantees nothing is missed and gives you a one-glance slide/appendix.

--- PAGE 3 ---
3.1 Functional requirements
PS
Section
Requirement Feature in PRAVAH-AICTE Demo proof Automated test
A Auto-route through applicable
stages (Only Scrutiny,
Scrutiny+EVC, EVC+SAC/SHC,
Only EVC, others)
Rule-based track assignment + versioned
workﬂow deﬁnitions (Module A)
Submit 4
applications → 4
different tracks
assigned
workflow.tracks.spec — every
track, every transition
A Auto-move to next stage on
completion of preceding stage
Transition service with guards; onEnter
actions
Officer clears
scrutiny → ﬁle
lands in EVC
queue instantly
workflow.autoadvance.spec
A Authorised return/revert with
reasons recorded
REVERT_FOR_DEFICIENCY with
structured reason codes + remarks; pauses
officer SLA, starts institution response
clock
Revert demo,
audit entry,
institution
notiﬁcation
revert.spec (reason mandatory,
SLA pause/resume correct)
A Automate routine
communications & electronic
case summaries
Template engine (EN/HI) + Case Summary
PDF (draft, officer-ﬁnalised)
One-click case
summary
download
casesummary.snapshot.spec
B Real-time consolidated
dashboard (region, stage,
institution, officer)
Command Center with live WebSocket
updates
HQ dashboard
ﬁlters
dashboard.aggregates.spec
B Ageing, timelines, workload,
bottlenecks
SLA % engine, workload distribution,
bottleneck stage ranking
Bottleneck
heatmap
sla.calc.property.spec
B Alerts for
approaching/exceeding
timelines
Sweeper + escalation matrix Time-travel
demo
sweeper.exactlyonce.spec
B Role-based dashboards 5 role views with scoped data access Log in as each
role
rbac.scope.spec
B Complete digital audit trail Hash-chained append-only log + veriﬁer Audit viewer
"Verify chain ✓ "
audit.chain.spec,
audit.tamper.spec
C Identify applications needing
EVC, queue after preliminary
processing
EVC_QUEUE on-enter action, priority
scoring
Auto-jump to
EVC queue
evc.queue.spec
C Track EVC
scheduling/completion (esp.
new institutions)
EVC tracker with new-institution priority &
deadlines
EVC calendar,
overdue badge
evc.deadlines.spec
C Reminders and escalation of
delayed EVCs
T-5 / T-2 / T+1 style offsets (conﬁgurable) Time-travel +15
days
evc.escalation.spec
D Digital record of approvals with
time-bound undertakings,
conditions, evidence, due dates
Undertaking Ledger auto-created on
APPROVED_WITH_UNDERTAKING
Undertaking list
per institution
undertaking.create.spec
D Notify institutions of upcoming
deadlines; online submission of
documents
Tiered alerts + secure evidence upload Institution portal
upload
undertaking.alerts.spec
D Track submission & veriﬁcation
by authorised officials
Submit → Verify/Reject → Close workﬂow Officer
veriﬁcation
screen
undertaking.verify.spec

--- PAGE 4 ---
PS
Section
Requirement Feature in PRAVAH-AICTE Demo proof Automated test
D Reminders & escalation when
unfulﬁlled beyond timeline
BREACHED_ESCALATED + escalation
chain
Fast-forward
demo
undertaking.breach.spec
E Track lease/document validity
and expiry
Tracked-document register with
expiryDate
Expiry calendar docs.expiry.spec
E Advance alerts, renewal
submission, veriﬁcation
90/60/30/15/7 (conﬁgurable) + renewal
upload + AI-assisted veriﬁcation
Lease renewal
ﬂow
docs.renewal.spec
E Overdue alerts & escalation for
expired/non-renewed
EXPIRED + COMPLIANCE_DEFICIENT +
escalation
Expired lease
escalated
docs.expired.spec
F Conﬁgurable notiﬁcations for all
event types
Template + rule conﬁguration UI Edit a reminder
offset live
notif.config.spec
F Auto-escalate overdue matters
per timelines
Multi-level escalation matrix Level 0/1/2 chain escalation.matrix.spec
F Consolidated reports (pendency,
EVC status, undertakings,
document validity, overdue,
region-wise performance)
Reports module (6 reports, XLSX/PDF,
scheduled)
Report download reports.spec
F Complete audit trail of alerts,
submissions, veriﬁcation,
escalations, closure
Every one of those emits an audit event Audit viewer
ﬁltered by case
audit.coverage.spec
3.2 Key requirements
Key requirement How satisﬁed
Single integrated platform One monorepo, one database, one audit chain across approval + compliance
Conﬁgurable rules/timelines aligned with APH Versioned WorkflowDefinition, SlaPolicy, EscalationRule, DocType tables +
admin UI
Secure storage, RBAC, conﬁdentiality, traceable
actions
Encrypted vault, malware scan, region-scoped data access, step-up auth, audit chain (Section
7)
Integration with existing AICTE systems where
feasible
Adapter layer + OpenAPI + bulk import (Section 7.6)
Human oversight for regulatory decisions Statutory-action guard in the state machine (Section 5.5)

--- PAGE 5 ---
3.3 Evaluation criteria → how we prove each one
Evaluation criterion
(from PS)
Proof artifact in the prototype
Workﬂow accuracy Golden-path suite over all tracks; transition table exported to the PPT; "illegal transition" attempts are rejected and logged
Timeliness of alerts Proof Panel shows scheduled time vs dispatched time for every alert; target: dispatched within one sweep interval of the
threshold
Reliability of deadline
tracking
365-day simulation run over 5,000 synthetic records asserting exactly one alert per tier per entity and zero missed
deadlines, including a simulated 24-hour worker outage with catch-up
Visibility of pending
cases
HQ command center + saved ﬁlters ("Red/Critical", "EVC overdue", "Leases expiring ≤ 30 days")
Reduction in manual
follow-up
Counter of "manual follow-ups avoided" (each auto-sent reminder/escalation that would have been a phone call/email) —
framed as a measurable pilot metric, not a guaranteed percentage
Completeness of digital
audit trail
Audit coverage test (every state-changing endpoint emits an event) + one-click chain veriﬁcation
4. System Architecture & Deﬁnitive Tech Stack
4.1 Architecture diagram (use on PPT Slide 3/4)
+--------------------------------------------------------------------------------------------------+
|                               PRESENTATION LAYER  (Next.js 15, TypeScript)                       |
|  [Institution Portal] [Scrutiny / EVC / SAC-SHC Officer Portal] [RO & Bureau Command Center]     |
|  [Admin: APH Policy Configurator] [Audit Viewer] [Proof Panel]        EN / िह ी   | WCAG 2.1 AA  |
+-------------------------------------------------+------------------------------------------------+
| HTTPS REST + WSS  (OIDC/JWT, RBAC, TOTP step-up)
+-------------------------------------------------v------------------------------------------------+
|                         API SERVICE (NestJS + Fastify)  — domain modules                         |
|  A Workflow Engine | B SLA & Analytics | C EVC Scheduler | D Undertakings | E Doc Validity |      |
|  F Notifications, Escalation & Reports  |  Auth/RBAC/Scoping | Audit Service | Clock Service     |
|  Integration Adapters: [AICTE Portal] [SSO/OIDC] [Email/SMS Gateway] [eSign] [DigiLocker*]       |
+-----------------------+---------------------------------------+----------------------------------+
| domain events (transactional outbox)  |
+---------------v---------------+       +---------------v--------------------------------+
| WORKER SERVICE (NestJS)       |       | DATA & PERSISTENCE                              |
| - Deterministic SLA/Expiry    |       | - PostgreSQL 16 (+ pg_trgm, RLS hardening)      |
|   Sweeper (idempotent)        |       | - Prisma ORM                                    |
| - BullMQ: delivery, retries,  |       | - MinIO / S3 (SSE-encrypted document vault)     |
|   OCR jobs, PDF jobs          |       | - Redis (queues, rate limits, WS fan-out)       |
| - Daily audit anchoring       |       | - Append-only hash-chained audit_logs           |
+-------------------------------+       +-------------------------------------------------+

--- PAGE 6 ---
4.2 Architecture decisions (each with a one-line rationale — useful for judge Q&A)
# Decision Rationale
D1 TypeScript pnpm monorepo (apps/web,
apps/api, apps/worker, packages/*)
One language, shared Zod schemas/types between UI and API, six people can work in
parallel without contract drift.
D2 NestJS API (Fastify adapter) — not "NestJS or
FastAPI"
v1 left this open and the folder structure assumed Next.js API routes. A deﬁnitive choice
removes ambiguity; Next.js is UI only.
D3 Workﬂow = XState v5 machines generated
from versioned JSON deﬁnitions + 
json-
rules-engine for track assignment
Handbook-as-data. Machines are built at runtime from the active deﬁnition version.
D4 Stages are string keys, not a Prisma enum A no-code conﬁgurator is impossible if stages are compiled into an enum (v1 inconsistency).
D5 Deterministic sweeper + BullMQ for delivery
(not "one delayed job per deadline")
Delayed jobs are lost/duplicated on Redis ﬂush or deploys and cannot follow a virtual clock.
The sweeper derives due work from DB columns (nextAlertAt), is idempotent via unique
dedupeKey, and catches up after downtime. BullMQ handles retry/backoff of delivery only.
D6 Virtual ClockService — every piece of code
calls clock.now(), never Date.now()
Enables the Time-Travel demo and the 365-day simulation test without touching row data.
Offset stored in system_clock; only active when DEMO_MODE=true.
D7 Transactional outbox for events (state change
+ event row in one DB transaction)
Guarantees no lost alerts/audit events if the process dies between "state changed" and
"notify".
D8 Business logic in a service layer, not DB
triggers (v1 proposed a DB trigger for EVC
queueing)
Testable, observable and versioned with the workﬂow deﬁnition; triggers hide logic from
reviewers.
D9 Working-day SLA with holiday calendar and
pause/resume
Government timelines are working-day based and the clock must stop while the ﬁle is with
the institution.
D10 Per-stream hash chain + daily Merkle anchor
(not one global chain)
A single global chain serialises every write and races under concurrency; per-application
chains scale, and a daily anchor row ties all stream heads together.
D11 Document extraction = deterministic baseline
+ optional LLM, always human-conﬁrmed
The demo must work offline; the officer remains the decision-maker; avoids sending
sensitive documents to external APIs in production.
D12 Scoped Prisma client per request (+ Postgres
RLS as hardening)
Region/institution scoping enforced in one place rather than in every query.
4.3 Deﬁnitive tech stack
Frontend: Next.js 15 (App Router, TypeScript), Tailwind CSS, shadcn/ui, TanStack Table v8, Recharts, a lightweight map
(react-simple-maps / SVG India map by region), next-intl (English + Hindi), Socket.io-client for live toasts, 
 react-big-
calendar for EVC scheduling, react-pdf for in-browser PDF/lease preview with extracted-clause highlighting.
Backend: Node 20, NestJS 10 + Fastify, Zod (shared validation), OpenAPI/Swagger auto-generated, class-validator only at
the edges.
Workﬂow & Rules: xstate@5, json-rules-engine, a custom workingDays utility (holiday-aware).
Database: PostgreSQL 16, Prisma ORM, pg_trgm for search, advisory locks for audit chain writes, DB trigger only to block
UPDATE/DELETE on audit_logs.
Queues & scheduling: Redis 7 + BullMQ (delivery, retries, OCR/PDF jobs) + NestJS @nestjs/schedule for the sweeper tick.
Document vault & intelligence: MinIO (S3-compatible, SSE encryption) / AWS S3; ClamAV for malware scan; pdfjs-dist
(text layer) → tesseract.js (scanned PDFs/images) → optional Gemini Flash via a provider interface; regex + date-grammar
baseline so extraction works with no network.
Reporting:Puppeteer (Electronic Case Summary PDF), exceljs (XLSX exports), cron-scheduled weekly digests.
Notiﬁcations: SMTP (Mailpit in dev, NIC/SES in prod), SMS gateway adapter (DLT-registered templates are mandatory in
India — mocked and logged in the demo), In-App via WebSocket, WhatsApp Business API as an optional adapter (not required
for the prototype).
Auth: OIDC (Keycloak in dev as stand-in for AICTE SSO), JWT access + refresh, TOTP step-up for statutory actions.

--- PAGE 7 ---
Quality: Vitest/Jest, Playwright (E2E that is the demo script), Testcontainers (Postgres/Redis), k6 (optional load test), ESLint +
TypeScript strict, GitHub Actions CI.
Deployment: Docker Compose (web, api, worker, postgres, redis, minio, clamav, mailpit, keycloak) — one
command boots everything; cloud deploy on a single VM / Render / Railway for a live demo link.
5. Workﬂow Engine, SLA Engine & Safeguard Design (the core IP)
5.1 Workﬂow deﬁnition format (stored in DB, versioned, effective-dated)
Each approval track is a JSON document. All durations below are PLACEHOLDER values — replace from APH.
statutory: true on a stage or action marks it as a statutory decision → protected by the HITL guard (5.5).
The four required families map to deﬁnitions: ONLY_SCRUTINY, SCRUTINY_PLUS_EVC, EVC_PLUS_SAC_SHC (EVC →
SAC_SHC_REVIEW → competent authority), ONLY_EVC, plus an extensible OTHER_COMBINATION slot (the PS says "and other
combinations prescribed under the APH"). A ﬁfth/sixth track can be added from the admin UI live in the demo.
Versioning: applications are pinned to the deﬁnition version active at submission (workflowDefinitionId). New versions
apply to new applications; an admin can optionally migrate in-ﬂight applications with an audited bulk action.
Deﬁnition validator (runs on save): every stage reachable, no dead ends, every actions target exists, at least one terminal
stage, statutory stages have roles, SLA > 0 for human stages. Invalid deﬁnitions cannot be activated.
5.2 Track assignment (rules engine)
Facts available to rules: applicationType, isNewInstitution, intakeDeltaPct, hasOpenDeficiency, previousApprovalYears,
hasPendingUndertaking, regionCode, programLevel. Rules are priority-ordered; the rule that ﬁred is stored on the application
 
json
{
"code":"SCRUTINY_PLUS_EVC",
"version":3,
"academicYear":"2026-27",
"effectiveFrom":"2026-11-01",
"initial":"SUBMITTED",
"stages":{
"SUBMITTED": {"kind":"auto", "next":"SCRUTINY"},
"SCRUTINY": {"kind":"human","roles":["SCRUTINY_OFFICER"],"slaWorkingDays":7,
"actions":{"CLEAR":"EVC_QUEUE","REVERT":"DEFICIENCY_REVERTED","RECOMMEND_REJECT":
"DEFICIENCY_REVERTED":{"kind":"institution","responseWorkingDays":10,"pausesOfficerSla":true,
"actions":{"RESUBMIT":"RE_SCRUTINY"},"onTimeout":"ESCALATE_TO_RO"},
"RE_SCRUTINY": {"kind":"human","roles":["SCRUTINY_OFFICER"],"slaWorkingDays":5,
"actions":{"CLEAR":"EVC_QUEUE","REVERT":"DEFICIENCY_REVERTED"}},
"EVC_QUEUE": {"kind":"queue","slaWorkingDays":5,"onEnter":["CREATE_EVC_SCHEDULE"],
"actions":{"SCHEDULE":"EVC_SCHEDULED"}},
"EVC_SCHEDULED": {"kind":"human","roles":["EVC_MEMBER"],"slaWorkingDays":15,
"actions":{"SUBMIT_REPORT":"COMPETENT_AUTHORITY_REVIEW","RESCHEDULE":"EVC_SCHEDULE
"COMPETENT_AUTHORITY_REVIEW":{"kind":"human","statutory":true,"roles":["REGIONAL_OFFICER","BUREAU_HEAD"]
"actions":{"APPROVE":"APPROVED_FINAL","APPROVE_WITH_UNDERTAKING":"APPROVED_WITH_UN
"APPROVED_WITH_UNDERTAKING":{"kind":"terminal","onEnter":["CREATE_UNDERTAKING_RECORDS","ISSUE_APPROVAL_DRA
"APPROVED_FINAL": {"kind":"terminal","onEnter":["ISSUE_APPROVAL_DRAFT","SCHEDULE_DOC_WATCHERS"]},
"REJECTED": {"kind":"terminal"}
}
}
json
{
"conditions":{"all":[
{"fact":"applicationType","operator":"equal","value":"NEW_INSTITUTION"}]},
"event":{"type":"ASSIGN_TRACK","params":{"track":"SCRUTINY_PLUS_EVC"}},
"priority":100
}

--- PAGE 8 ---
(trackAssignmentReason) so the officer — and the audit trail — can see why a track was chosen. Admin UI includes a "dry-run"
panel (enter facts → see the track and path).
5.3 SLA engine
Let W(a,b) be the number of working days between a and b (weekends and the HolidayCalendar excluded; regional holidays
supported), and P the total paused working time while the ﬁle sat with the institution.
One threshold set, used everywhere (v1 used 70% in one place and 75% in another):
State SLA consumed Dashboard colour Automated action
GREEN < 75% Green none
AMBER 75% – < 100% Amber Level 0: reminder to assigned officer (in-app + email)
RED 100% – < 125% Red Level 1: escalate to Regional Officer / Assistant Director
CRITICAL ≥ 125% Dark red Level 2: escalate to Director, Regulation Bureau (HQ)
PAUSED clock stopped Grey/blue institution response clock runs instead
Thresholds (75/100/125) and the number of levels are rows in EscalationRule, not constants.
Pause/resume: entering an institution-kind stage sets slaPausedAt; leaving it adds elapsed working time to
slaPausedTotalSec and recomputes stageSlaDeadline. Property-based tests (fast-check) verify that for any sequence of
pauses the deadline equals entry + duration + total paused working time.
nextAlertAt is persisted on each entity = the earliest future threshold crossing; the sweeper only needs 
WHERE nextAlertAt
<= clock.now() (indexed) — O(due items), not O(all items).
5.4 The deterministic sweeper (reliability of deadline tracking)
Properties (each is a test): idempotent (running twice never double-sends), catch-up safe (24h outage → on restart every missed tier
is sent once, in order, ﬂagged isCatchUp=true), crash-safe (state change, audit and outbox row commit atomically), observable
(Proof Panel shows lag = dispatchedAt − dueAt).
5.5 Human-in-the-Loop (Regulatory Safeguard) — enforced, not just stated
1. Every action in a deﬁnition has a statutory ﬂag (default false; APPROVE, APPROVE_WITH_UNDERTAKING, REJECT,
ISSUE_SHOW_CAUSE, CLOSE_UNDERTAKING_AS_BREACHED, SAC_SHC_OUTCOME are true).
2. The state machine guard rejects a statutory action unless all hold: actor.type === USER, actor.role ∈  stage.roles, actor's
region/scope matches, step-up authentication (fresh TOTP, ≤ 5 min) veriﬁed, and a mandatory remarks ﬁeld is present.
3. actor.type === SYSTEM can never trigger a statutory action — unit-tested with a "system tries to approve" test that must fail.
4. Every system-generated artefact (case summary, recommended track, extracted date, suggested SLA reason) carries a visible
"System-generated — for officer veriﬁcation" badge and records generatedBy = SYSTEM + the officer who accepted it
(acceptedById).
5. Show-cause / penalty review is only ever suggested (a queue item for the Bureau), never auto-issued.
6. The ActionSignature table links each statutory audit entry to the step-up method (TOTP_STEP_UP in the prototype; ESIGN /
DSC adapters for production).
SLA Consumed (%) =  ×Prescribed Stage DurationW (StageEntry,  clock.now()) − P 100
every 60s (and once on worker boot):
now = clock.now()
rows = SELECT entity FROM (applications, evc_schedules, undertakings, tracked_documents)
WHERE nextAlertAt <= now AND status is active   -- indexed, LIMIT batch, FOR UPDATE SKIP LOCKED
for each row:
compute due tier(s) (could be several if the system was down)
for each tier: INSERT notification(dedupeKey = "<entity>:<id>:<tierKey>")  ON CONFLICT DO NOTHING
apply state change (SLA state / escalationLevel / BREACHED / EXPIRED) + audit event + outbox, same
transaction
recompute nextAlertAt
delivery workers pick PENDING notifications → send → mark SENT / retry with backoff / dead-letter

--- PAGE 9 ---
5.6 Audit trail design (tamper-evident)
Streams: one hash chain per streamKey (APP:<applicationId>, INST:<institutionId>, SYS). Within a stream, seq
increases by exactly 1; writes take a pg_advisory_xact_lock(hashtext(streamKey)).
Canonical hash input (JSON canonicalised with sorted keys, UTC ISO-8601 timestamps, so veriﬁcation is reproducible):
The ﬁrst entry in a stream uses a ﬁxed genesis value (hash_0 = SHA256("PRAVAH-GENESIS|" + streamKey)).
Database enforcement: a trigger raises an exception on any UPDATE/DELETE of audit_logs; the application DB role has
INSERT, SELECT only.
Daily anchor: the worker computes a Merkle root over every stream head and stores it in audit_anchors; the anchor can
additionally be emailed to the Bureau Head or notarised externally in production. This detects wholesale truncation of a stream,
not just edits.
Veriﬁcation:GET /audit/verify?stream=APP:<id> recomputes the chain and returns OK or the ﬁrst broken seq. The UI has
a "Verify chain" button, and a "Simulate tampering" demo toggle (edits a row in a sandbox copy) to show detection.
Wording: call it tamper-evident (v1 said "tamper-proof" — a database administrator can always alter data; what the design
guarantees is that alteration is detected).
6. Module-by-Module Implementation Blueprint (Modules A–F)
Module A — End-to-End Approval Workﬂow Automation
Capabilities
Intake & track assignment: application arrives (portal adapter / bulk import / demo "new application" form) → rules engine
assigns track → ApplicationStageHistory row opened → SLA deadline computed → ﬁrst alert time set.
Auto-advance: completing a human action moves the ﬁle to the next stage in the same transaction (state change + audit +
outbox); stage onEnter actions run (create EVC schedule, create undertaking records, draft approval letter, schedule document
watchers).
Authorised revert / return (deﬁciency loop):
Structured reason codes (conﬁgurable list, e.g. Document missing, Document illegible, Land/lease deﬁciency, Faculty
deﬁciency, Infrastructure clariﬁcation, Fee/FDR issue, Other) + free-text remarks + optional per-item deﬁciency checklist
(Deficiency + DeficiencyItem).
Revert pauses the officer's SLA, starts the institution's response clock, notiﬁes the institution immediately (in-app + email
+ SMS), and shows the checklist in the institution portal.
Institution uploads clariﬁcations per item → ﬁle auto-routes to Re-Scrutiny (or the conﬁgured next stage) and the officer
SLA resumes.
If the institution does not respond within the response window → reminder ladder, then escalation to the RO (never an
automatic rejection — rejection is statutory).
Further veriﬁcation / clariﬁcation: an officer can send a clariﬁcation request (lighter than a deﬁciency revert) that does not
change stage but opens a timed query thread.
Bulk & delegated actions: reassign officer, bulk reassign on leave (audited), delegation with start/end date.
Electronic Case Summary (see Module F-2): includes institution proﬁle, track and path taken, stage timeline with durations, all
deﬁciencies and responses, EVC ﬁndings, committee outcome, pending undertakings, document validity status, SLA
performance — rendered as a DRAFT PDF with a content hash; the competent authority "ﬁnalises" it, which writes an audit
event.
Standardised communications: template library (EN/HI) — acknowledgement, deﬁciency notice, EVC intimation, undertaking
reminder, expiry reminder, escalation notice, closure notice — with variable substitution and preview; all templates are
versioned.
Key endpoints:POST /applications, GET /applications/:id, POST /applications/:id/actions/:action, 
POST
/applications/:id/revert, POST /applications/:id/resubmit, POST /applications/:id/reassign, 
GET
/applications/:id/timeline, POST /applications/:id/case-summary.
Edge cases handled: duplicate submission, resubmission after rejection (new application, linked history), withdrawal, deﬁnition
version change mid-ﬂight, officer on leave, region transfer, action attempted from a stale UI (optimistic-lock version ﬁeld → 409).
Module B — Integrated Dashboard & Pendency Monitoring
Role-based views (each backed by scoped queries — a Regional Officer can never see another region unless granted):
hash  =n SHA256(hash  ∥n−1 streamKey ∥ seq  ∥n actorType ∥ actorId ∥ actionType ∥ entity ∥ SHA256(payload) ∥ timestamp)

--- PAGE 10 ---
Role View Highlights
Bureau Head / Bureau
Officer (HQ)
National
Command Center
Map coloured by region SLA health; funnel by stage; top bottleneck stages; officer workload
distribution; "Red & Critical" feed; EVC overdue; undertakings breached; leases expired; region
league table
Regional Officer Regional Desk Region queue; escalations needing intervention; EVC scheduling board; officer-wise workload
with reassign; upcoming compliance deadlines for region institutions
Scrutiny Officer / EVC
Member / SAC-SHC
Member
My Work Assigned ﬁles sorted by SLA urgency; keyboard-friendly action bar; deﬁciency modal; EVC
calendar; conﬂict-of-interest warnings
Institution Admin Institution Portal Live pizza-tracker of the application; deﬁciency checklist; undertaking list with due countdown;
document expiry calendar; notiﬁcation inbox; downloadable acknowledgements
Auditor Audit Viewer
(read-only)
Chain veriﬁcation, ﬁlters by case/actor/action, export
System Admin Policy
Conﬁgurator
Workﬂow deﬁnitions, SLA policies, escalation matrix, templates, holiday calendar, doc types
Analytics (all computed server-side, cached with short TTL, pushed by WebSocket on change):
Ageing buckets (0–7, 8–15, 16–30, 30+ working days) by stage and region
Bottleneck index per stage = mean SLA% × volume
Workload balance = open ﬁles per officer vs. region median (Gini or max/median ratio)
Throughput and median turnaround by track/application type
Forecast: ﬁles predicted to breach in the next 7 days (based on current SLA% and remaining time) — shown as advisory
Saved views and shareable ﬁlter URLs; CSV/XLSX export of any table
Performance targets (tested): dashboard aggregates p95 < 1 s on 50,000 synthetic applications (via indexed stage, regionId,
slaState, nextAlertAt), live update latency < 2 s.
Module C — EVC Scheduling & Alerts
Auto-queueing:EVC_QUEUE.onEnter creates an EvcSchedule (status QUEUED) in the application's region queue; the queue is
ordered by a transparent priority score = new-institution weight + SLA% + days in queue + conﬁgured deadline proximity
(score breakdown visible on hover — no black box).
Mode:PHYSICAL | ONLINE | HYBRID (per the Dec-2025 corrigendum); the online mode skips travel logistics ﬁelds.
Committee composition:EvcCommitteeMember rows (lead + members), conﬁgurable minimum size, conﬂict-of-interest check
(member's institution/state vs. applicant; prior association ﬂag) before scheduling is conﬁrmed.
Scheduling calendar: drag-to-schedule, reschedule with mandatory reason (history kept, rescheduleCount shown), clash
detection for members.
Deadlines: prescribedDeadline (visit to be completed) and reportDueAt (report to be submitted) tracked separately — new
institutions use a stricter window (conﬁgurable).
Reminders/escalation (offsets conﬁgurable per rule): unscheduled for N days after queueing → reminder to RO; visit due in 5
and 2 working days → reminder to committee lead; report overdue at +1 day → RO; +3 days → Bureau.
Report intake: structured EVC report upload (score/observations + attachments) → triggers auto-advance to the next stage.
Module D — Time-Bound Undertakings & Institutional Compliance
Ledger creation: on APPROVE_WITH_UNDERTAKING (or on SAC/SHC outcome RECOMMENDED_WITH_UNDERTAKING) the officer
selects/creates conditions from a condition library (e.g. Recruit and upload faculty details, Barrier-Free Environment certiﬁcate,
Fire safety certiﬁcate, Anti-ragging committee constitution, Display of information on website), each with a due date, evidence
requirements and verifying role. One Undertaking per condition.
Lifecycle:
PENDING_SUBMISSION → SUBMITTED_UNDER_REVIEW → VERIFIED_COMPLIANT | DEFICIENT_REVERTED → (resubmit)
… and OVERDUE_ESCALATED / BREACHED when past due.
Reminder ladder (conﬁgurable): T-30, T-15, T-7, T-3 working/calendar days (calendar-day basis by default for institution-facing
deadlines — set per rule), due day, then overdue ladder +1, +7, +15.

--- PAGE 11 ---
Evidence submission: drag-and-drop (PDF / images, geo-tagged photo support — EXIF GPS/time shown to the veriﬁer),
malware scan, SHA-256 ﬁngerprint, versioned.
Veriﬁcation: assigned official clicks VERIFY_AND_CLOSE or REJECT_RESUBMIT (reason mandatory). Closing is recorded with an
ActionSignature.
Extension requests: the institution can request an extension with justiﬁcation; approval is a statutory-ﬂagged action by the
competent authority (never auto-granted); extension history is retained.
Breach handling:current_date > due_date and not veriﬁed → BREACHED_ESCALATED, escalation to RO then Bureau, and a
"Show-cause review" queue item is created for human decision — the system never issues penalties.
Institution compliance score (advisory): weighted view of on-time undertakings, document validity and response times, used
as a watchlist signal for officers, with the formula visible.
Module E — Lease & Document Validity Monitoring
Conﬁgurable document types (table DocType): Registered Lease Deed, Fire Safety Certiﬁcate, Building
Completion/Occupancy Certiﬁcate, Bank Guarantee/FDR, plus any prescribed document the APH speciﬁes. Each type has:
whether expiry applies, minimum validity rule (e.g. lease min-years check), reminder offsets, which stages require it.
Upload & extraction pipeline: upload → malware scan → SHA-256 → text layer (pdfjs-dist) → OCR fallback (tesseract.js)
→ extractor returns {documentNumber, issueDate, expiryDate/leaseTerm, registrationDetails, stampDuty} with per-
ﬁeld conﬁdence and the source text span + page → UI shows the PDF with the detected clause highlighted.
Human conﬁrmation is mandatory: extracted values pre-ﬁll a form; the verifying officer conﬁrms/edits; the ﬁnal values (not
the AI's) drive deadlines. Low-conﬁdence ﬁelds are ﬂagged amber and cannot be auto-accepted.
Cross-checks (advisory ﬂags): expiry before issue date; lease term shorter than the required minimum; document number
format; date mismatch between form entry and document; ﬁle hash already used by another institution (possible reuse) — each
shown as a ﬂag for the officer, never an automatic rejection.
Lease-term logic: if the lease is expressed as a term ("30 years from registration"), expiry is computed and the computation is
shown.
Reminder ladder: 90, 60, 30, 15, 7 days before expiry (conﬁgurable per DocType), expiry day, then overdue +1, +7, +30.
Renewal workﬂow: institution uploads renewed document → new FileVersion → veriﬁcation → previous version archived,
expiry updated, alert ladder reset, overdue ﬂags cleared, audit entry.
On expiry without renewal: status EXPIRED, institution ﬂagged COMPLIANCE_DEFICIENT (visible in the next approval cycle's
scrutiny checklist), escalation to RO/Bureau.
Institution document calendar: month view with colour-coded expiries; downloadable .ics feed so the institution's own
calendar also reminds them.
Module F — Notiﬁcations, Escalation, Reporting & Audit
F-1 Notiﬁcation engine
Event catalogue: application received, stage assigned, SLA amber/red/critical, deﬁciency raised, response due/overdue, EVC
queued/scheduled/due/overdue, undertaking T-x/overdue/breached, document T-x/expired/renewed, escalation
raised/acknowledged/closed, report ready.
Rules (conﬁgurable in UI): event → recipients (role/officer/institution) → channels → template → timing offsets → quiet hours →
de-duplication window.
Channels: In-App (WebSocket + inbox), Email, SMS (adapter), WhatsApp (optional adapter). Templates in English and Hindi;
institution preferred language respected.
Delivery guarantees:dedupeKey unique → at-most-once creation; BullMQ retries with exponential backoff; dead-letter queue
visible to admins; delivery status and readAt stored (so "was this alert actually acknowledged?" is answerable).
Escalation acknowledgement: an escalation stays "open" and re-notiﬁes at the next level until a human acknowledges it with a
remark — the chain doesn't just ﬁre-and-forget.
Digest mode: daily digest per officer (what's due today / this week) to reduce alert fatigue.
F-2 Reports (all with XLSX + PDF export, ﬁlters, and optional weekly scheduled email)

--- PAGE 12 ---
# Report Key columns / charts
R1 Application pendency Region × stage × ageing bucket, officer-wise, SLA state
R2 EVC status Queued / scheduled / completed / overdue, new-institution compliance %, mode split
R3 Undertaking compliance Due / submitted / veriﬁed / breached by region & condition type
R4 Document validity Expiring ≤ 90 days, expired, renewal-in-progress, by DocType & region
R5 Overdue & escalations Level-wise open escalations, time-to-acknowledge, repeat offenders
R6 Region-wise processing performance Median turnaround, SLA adherence %, throughput, workload balance
F-3 Audit trail — see Section 5.6. Audit events are emitted for: stage transitions, reverts/resubmissions, document
uploads/veriﬁcations, undertaking changes, alert dispatches, escalations & acknowledgements, conﬁguration changes (who changed
which SLA from what to what), logins to privileged roles, exports.
7. Cross-Cutting Concerns
7.1 Security architecture
AuthN/Z: OIDC SSO (adapter), short-lived JWT + refresh rotation, RBAC + scope (region / institution / assigned-only), TOTP
step-up for statutory actions, session timeout, concurrent-session alerts for privileged roles.
Data scoping: scoped Prisma client injects region/institution ﬁlters; Postgres RLS policies as defence-in-depth in production;
automated test that iterates every role × every endpoint and asserts no cross-scope leakage.
Document vault: SSE encryption at rest, TLS in transit, pre-signed URLs with ≤ 5-minute expiry, no public buckets,
downloads watermarked with officer ID + timestamp, ﬁle-type allow-list by magic bytes, size limits, ClamAV scan with
quarantine, SHA-256 ﬁngerprinting.
Application hardening: OWASP ASVS L2 checklist, Helmet/CSP, CSRF protection for cookie ﬂows, rate limiting (Redis), input
validation (Zod) at every boundary, parameterised queries only (Prisma), secrets via env/secret manager, dependency audit in
CI, SBOM generation.
PII minimisation & retention: store only data needed for the workﬂow; conﬁgurable retention; export/erasure workﬂow aligned
with the Digital Personal Data Protection Act, 2023 principles; no PII in logs.
Hosting note for the PPT: production deployment on a MeitY-empanelled / NIC cloud with India data residency, CERT-In
incident reporting readiness, and a pre-go-live security audit (e.g. STQC/CERT-In empanelled auditor). State this as the
deployment path, not as something already done.
7.2 Accessibility, language & usability (government-grade polish)
WCAG 2.1 AA and GIGW 3.0 alignment: keyboard navigation, focus states, colour-contrast-safe SLA palette (never colour alone
— icon + text label on every badge), screen-reader labels, reduced-motion support.
Bilingual UI & notiﬁcations: English + Hindi (next-intl), extensible to regional languages.
Low-bandwidth resilience for institution users: lightweight pages, resumable uploads, clear upload progress and retry.
Officer ergonomics: keyboard shortcuts for clear/revert, saved ﬁlters, bulk actions with conﬁrmation, undo for non-statutory
changes.
7.3 Data & AI governance
AI is used for extraction and summarisation assistance only — never for decisions.
Every AI/OCR output stores: model/provider, version, conﬁdence, source span, and the human who accepted or overrode it (the
override rate is a quality metric on the Proof Panel).
Provider interface (DocumentIntelligenceProvider) with three implementations: RegexBaseline (offline, deterministic —
used in the demo by default), TesseractOCR, and GeminiFlash (optional). Production recommendation: on-premise /
sovereign model or redaction before any external call; demo documents are synthetic.
Prompt-injection safe: documents are treated as data, extraction output is schema-validated (Zod) and never executed.
7.4 Observability & operations
Structured JSON logs with correlation IDs; OpenTelemetry traces; Prometheus metrics (sweeper lag, queue depth, alert latency,
delivery failure rate); Grafana-style Ops page in the admin UI; health/readiness endpoints; sweeper heartbeat alert ("sweeper
hasn't run in 3 minutes" raises an admin alert).
Backups: nightly pg_dump + object-store versioning; documented RPO/RTO targets; restore drill noted in the runbook.

--- PAGE 13 ---
7.5 Conﬁguration administration (the "No-Code APH Policy Conﬁgurator")
Screens: Workﬂow Designer (stage graph editor with validation), SLA Matrix (stage × application-type grid), Escalation
Matrix (level × threshold × role × channel), Reminder Offsets, Template Editor (EN/HI + preview), Holiday Calendar,
Document Types, Reason Codes.
Every change is versioned, effective-dated, requires SYSTEM_ADMIN + step-up, shows a diff against the active version, supports
rollback, and writes a conﬁguration audit event (who/what/old/new).
A dry-run simulator previews the effect of a change on current open applications ("this SLA change would turn 14 ﬁles amber
today").
7.6 Integration with existing AICTE systems (adapter layer)
All external dependencies sit behind interfaces with a mock implementation for the demo and a documented contract for
production:
Adapter Purpose Prototype implementation Production path
AicteApprovalPortalAdapter Pull new/updated
applications, push status
back
Fixture-based mock + CSV/XLSX
bulk import + webhook receiver
REST/webhook integration with the
AICTE approval portal
IdentityAdapter SSO / user directory Keycloak (OIDC) AICTE SSO / NIC identity
MessagingAdapter Email, SMS, WhatsApp Mailpit + logged SMS NIC/SES SMTP, DLT-registered SMS
gateway, WhatsApp Business API
ESignAdapter Digital signature for
statutory actions
TOTP step-up eSign / DSC token
DocumentSourceAdapter Fetch certiﬁcates directly Upload only DigiLocker / issuing-authority APIs
where available
OpenAPI 3.1 spec is published from the API; webhooks (signed with HMAC) let other AICTE systems subscribe to events like
application.stage_changed, undertaking.breached, document.expired.
Migration path: a one-time bulk-import template (Excel) lets a Regional Office onboard its existing pendency spreadsheet on
day one — a strong adoption argument.
8. Complete Database Schema (prisma/schema.prisma)
Changes from v1: Region is a table (not an enum); stages are string keys (conﬁg-driven); added WorkflowDefinition,
RoutingRule, SlaPolicy, EscalationRule, HolidayCalendar, ApplicationStageHistory, Deficiency(+Item),
EvcCommitteeMember, FileVersion, Notification(+Template/Rule), CaseSummary, OutboxEvent, ActionSignature,
AuditAnchor, SystemClock; SLA pause ﬁelds; nextAlertAt indexes for the sweeper; per-stream audit chain; optimistic-lock
version. Run npx prisma validate && npx prisma migrate dev after pasting.
prisma

--- PAGE 14 ---
datasourcedb{
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generatorclient{
  provider = "prisma-client-js"
}
// ───────────── Enums ─────────────
enumRole{
  INSTITUTION_ADMIN
  SCRUTINY_OFFICER
  EVC_MEMBER
  SAC_SHC_MEMBER
  REGIONAL_OFFICER
  BUREAU_OFFICER
  BUREAU_HEAD
  AUDITOR
  SYSTEM_ADMIN
}
enumActorType{ USER SYSTEM }
enumApplicationType{
  NEW_INSTITUTION
  EXTENSION_OF_APPROVAL
  INCREASE_IN_INTAKE
  NEW_COURSE
  NEW_PROGRAM_OR_LEVEL
  CHANGE_OF_SITE
  CLOSURE
  OTHER
}
enumApplicationStatus{
  IN_PROGRESS
  WITH_INSTITUTION        // reverted / awaiting clarification (officer SLA paused)
  APPROVED
  APPROVED_WITH_UNDERTAKING
  REJECTED
  WITHDRAWN
}
enumSlaState{ GREEN AMBER RED CRITICAL PAUSED }
enumEvcMode{ PHYSICAL ONLINE HYBRID }
enumEvcStatus{ QUEUED SCHEDULED COMPLETED OVERDUE_ESCALATED CANCELLED }
enumComplianceStatus{
  PENDING_SUBMISSION
  SUBMITTED_UNDER_REVIEW
  VERIFIED_COMPLIANT
  DEFICIENT_REVERTED
  OVERDUE_ESCALATED
  BREACHED_ESCALATED
  EXTENSION_REQUESTED
  CLOSED
}
enumDocStatus{ VALID EXPIRING EXPIRED RENEWAL_SUBMITTED RENEWED }

--- PAGE 15 ---
enumNotificationChannel{ IN_APP EMAIL SMS WHATSAPP }
enumNotificationStatus{ PENDING SENT FAILED READ DEAD_LETTER }
enumSignatureMethod{ TOTP_STEP_UP ESIGN DSC }
enumScanStatus{ PENDING CLEAN INFECTED FAILED }
enumSummaryStatus{ DRAFT FINALISED }
// ───────────── Organisation & identity ─────────────
modelRegion{
  id           String @id@default(uuid())
  code         String @unique // e.g. SRO, SCRO, SWRO, WRO, ERO, NRO, NWRO, CRO, NERO (confirm list)
  name         String
  users        User[]
  institutions Institution[]
  applications Application[]
  holidays     HolidayCalendar[]
}
modelUser{
  id            String @id@default(uuid())
  name          String
  email         String @unique
  role          Role
  designation   String?
  regionId      String?
  region        Region?      @relation(fields: [regionId], references: [id])
  institutionId String?
  institution   Institution? @relation(fields: [institutionId], references: [id])
  preferredLang String @default("en") // "en" | "hi"
  totpSecretEnc String?                       // encrypted TOTP seed for step-up
  isActive      Boolean @default(true)
  delegatedToId String?                       // leave delegation
  delegationEnds DateTime?
  createdAt     DateTime @default(now())
  assignedApplications Application[]         @relation("AssignedOfficer")
  committeeMemberships EvcCommitteeMember[]
  notifications        Notification[]
}
modelInstitution{
  id               String @id@default(uuid())
  aictePermanentId String @unique // e.g. "1-46273286079"
  name             String
  state            String
  district         String?
  institutionType  String // "Engineering", "Pharmacy", "Polytechnic", ...
  regionId         String
  region           Region @relation(fields: [regionId], references: [id])
  complianceHealth String @default("GOOD") // GOOD | WATCHLIST | COMPLIANCE_DEFICIENT
  complianceScore  Float?                           // advisory, formula visible in UI
  users            User[]
  applications     Application[]
  undertakings     Undertaking[]
  documents        TrackedDocument[]
}
modelHolidayCalendar{
  id       String @id@default(uuid())

--- PAGE 16 ---
  date     DateTime@db.Date
  label    String
  regionId String?               // null = national
  region   Region?  @relation(fields: [regionId], references: [id])
@@unique([date, regionId])
}
// ───────────── Configuration (Handbook-as-data) ─────────────
modelWorkflowDefinition{
  id             String @id@default(uuid())
  code           String // ONLY_SCRUTINY | SCRUTINY_PLUS_EVC | EVC_PLUS_SAC_SHC | ONLY_EVC | c
  version        Int
  academicYear   String
  name           String
  definition     Json // see Section 5.1
  isActive       Boolean @default(false)
  effectiveFrom  DateTime
  supersededAt   DateTime?
  createdById    String
  createdAt      DateTime@default(now())
  applications   Application[]
  slaPolicies    SlaPolicy[]
@@unique([code, version])
}
modelRoutingRule{
  id         String @id@default(uuid())
  priority   Int
  name       String
  conditions Json // json-rules-engine conditions
  trackCode  String
  isActive   Boolean@default(true)
}
modelSlaPolicy{
  id                  String @id@default(uuid())
  workflowDefinitionId String
  workflowDefinition  WorkflowDefinition @relation(fields: [workflowDefinitionId], references: [id])
  stageKey            String
  applicationType     ApplicationType?    // null = all types
  durationWorkingDays Int // PLACEHOLDER values until APH is mapped
  warnPct             Int @default(75)
  breachPct           Int @default(100)
  criticalPct         Int @default(125)
@@unique([workflowDefinitionId, stageKey, applicationType])
}
modelEscalationRule{
  id          String @id@default(uuid())
  scope       String // APPLICATION_STAGE | EVC | UNDERTAKING | DOCUMENT | DEFICIENCY_RESPONSE
  level       Int
  triggerType String // PCT_OF_SLA | DAYS_BEFORE_DUE | DAYS_AFTER_DUE
  triggerValue Int
  targetRole  Role
  channels    NotificationChannel[]
  templateCode String
  isActive    Boolean@default(true)
@@unique([scope, level, triggerType, triggerValue])
}

--- PAGE 17 ---
modelDocType{
  code            String @id // LEASE_DEED | FIRE_SAFETY | OCCUPANCY_CERT | FDR | ...
  label           String
  hasExpiry       Boolean@default(true)
  minValidityYears Int?                    // e.g. lease minimum term, from APH
  reminderOffsets Int[]                    // days before expiry, e.g. {90,60,30,15,7}
  requiredAtStages String[]
}
modelReasonCode{
  code     String @id
  label    String
  category String // DEFICIENCY | EXTENSION | RESCHEDULE | REJECT_RESUBMIT
  isActive Boolean@default(true)
}
// ───────────── Core workflow ─────────────
modelApplication{
  id                   String @id@default(uuid())
  applicationNumber    String @unique // e.g. "APH2026-S-00412"
  institutionId        String
  institution          Institution @relation(fields: [institutionId], references: [id])
  regionId             String
  region               Region @relation(fields: [regionId], references: [id])
  academicYear         String
  applicationType      ApplicationType
  isNewInstitution     Boolean @default(false)
  workflowDefinitionId String
  workflowDefinition   WorkflowDefinition@relation(fields: [workflowDefinitionId], references: [id])
  trackAssignmentReason String?                        // which routing rule fired and why
  currentStage         String // stage key from the definition
  status               ApplicationStatus @default(IN_PROGRESS)
  stageEnteredAt       DateTime
  stageSlaDeadline     DateTime?
  slaPausedAt          DateTime?
  slaPausedTotalSec    Int @default(0)
  slaState             SlaState @default(GREEN)
  escalationLevel      Int @default(0)
  nextAlertAt          DateTime?                       // sweeper index
  assignedOfficerId    String?
  assignedOfficer      User?              @relation("AssignedOfficer", fields: [assignedOfficerId], references: [id]
  version              Int @default(1) // optimistic locking
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  stageHistory         ApplicationStageHistory[]
  deficiencies         Deficiency[]
  evcSchedules         EvcSchedule[]
  undertakings         Undertaking[]
  caseSummaries        CaseSummary[]
  auditLogs            AuditLog[]
@@index([regionId, currentStage, slaState])
@@index([nextAlertAt])
@@index([assignedOfficerId, slaState])
}
modelApplicationStageHistory{
  id            String @id@default(uuid())
  applicationId String

--- PAGE 18 ---
  application   Application@relation(fields: [applicationId], references: [id])
  stageKey      String
  enteredAt     DateTime
  exitedAt      DateTime?
  slaDeadline   DateTime?
  pausedTotalSec Int @default(0)
  actorId       String?
  actionTaken   String?                         // CLEAR | REVERT | ...
  slaStateAtExit SlaState?
@@index([applicationId, enteredAt])
}
modelDeficiency{
  id            String @id@default(uuid())
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id])
  raisedById    String
  reasonCode    String
  remarks       String
  raisedAt      DateTime
  responseDueAt DateTime
  respondedAt   DateTime?
  status        String @default("OPEN") // OPEN | RESPONDED | ACCEPTED | RE_RAISED
  nextAlertAt   DateTime?
  items         DeficiencyItem[]
}
modelDeficiencyItem{
  id           String @id@default(uuid())
  deficiencyId String
  deficiency   Deficiency @relation(fields: [deficiencyId], references: [id])
  description  String
  resolved     Boolean @default(false)
  responses    FileVersion[]
}
// ───────────── EVC ─────────────
modelEvcSchedule{
  id                 String @id@default(uuid())
  applicationId      String
  application        Application @relation(fields: [applicationId], references: [id])
  mode               EvcMode @default(PHYSICAL)
  constitutedBy      String @default("COUNCIL") // per Dec-2025 corrigendum; configurable
  queuedAt           DateTime
  priorityScore      Float @default(0)
  priorityBreakdown  Json?                                       // transparent score explanation
  scheduledStart     DateTime?
  scheduledEnd       DateTime?
  prescribedDeadline DateTime
  reportDueAt        DateTime?
  reportSubmittedAt  DateTime?
  rescheduleCount    Int @default(0)
  status             EvcStatus @default(QUEUED)
  escalationLevel    Int @default(0)
  nextAlertAt        DateTime?
  members            EvcCommitteeMember[]
@@index([status, nextAlertAt])
}
modelEvcCommitteeMember{
  id                String @id@default(uuid())

--- PAGE 19 ---
  evcScheduleId     String
  evcSchedule       EvcSchedule@relation(fields: [evcScheduleId], references: [id])
  userId            String
  user              User @relation(fields: [userId], references: [id])
  isLead            Boolean @default(false)
  conflictChecked   Boolean @default(false)
  conflictFlag      Boolean @default(false)
@@unique([evcScheduleId, userId])
}
// ───────────── Compliance ─────────────
modelUndertaking{
  id              String @id@default(uuid())
  institutionId   String
  institution     Institution @relation(fields: [institutionId], references: [id])
  applicationId   String
  application     Application @relation(fields: [applicationId], references: [id])
  conditionCode   String // from condition library
  conditionTitle  String
  description     String
  issuedAt        DateTime
  dueDate         DateTime
  originalDueDate DateTime
  extensionCount  Int @default(0)
  status          ComplianceStatus@default(PENDING_SUBMISSION)
  verifierRole    Role @default(REGIONAL_OFFICER)
  verifiedById    String?
  verifiedAt      DateTime?
  escalationLevel Int @default(0)
  nextAlertAt     DateTime?
  evidence        FileVersion[]
  version         Int @default(1)
@@index([status, nextAlertAt])
@@index([institutionId, dueDate])
}
modelTrackedDocument{
  id               String @id@default(uuid())
  institutionId    String
  institution      Institution @relation(fields: [institutionId], references: [id])
  docTypeCode      String
  documentNumber   String?
  issuingAuthority String?
  issueDate        DateTime?
  expiryDate       DateTime?
  status           DocStatus @default(VALID)
  currentVersionId String?
  escalationLevel  Int @default(0)
  nextAlertAt      DateTime?
  versions         FileVersion[]
@@index([status, nextAlertAt])
@@index([institutionId, expiryDate])
}
modelFileVersion{
  id                  String @id@default(uuid())
  versionNo           Int @default(1)
  storageKey          String
  fileName            String
  mimeType            String

--- PAGE 20 ---
  sizeBytes           Int
  sha256              String
  uploadedById        String
  uploadedAt          DateTime @default(now())
  scanStatus          ScanStatus @default(PENDING)
  extractionProvider  String?                              // RegexBaseline | TesseractOCR | GeminiFlash
  extractionJson      Json?                                // fields, confidence, source spans
  extractionConfidence Float?
  verifiedById        String?
  verifiedAt          DateTime?
  overriddenFields    String[]                             // fields the officer changed (quality metric)
  trackedDocumentId   String?
  trackedDocument     TrackedDocument? @relation(fields: [trackedDocumentId], references: [id])
  undertakingId       String?
  undertaking         Undertaking?     @relation(fields: [undertakingId], references: [id])
  deficiencyItemId    String?
  deficiencyItem      DeficiencyItem?  @relation(fields: [deficiencyItemId], references: [id])
@@index([sha256])
}
// ───────────── Notifications ─────────────
modelNotificationTemplate{
  code     String
  channel  NotificationChannel
  lang     String
  subject  String?
  body     String
  version  Int @default(1)
@@id([code, channel, lang])
}
modelNotification{
  id           String @id@default(uuid())
  dedupeKey    String @unique // "<entity>:<id>:<tierKey>" → exactly-once creation
  recipientId  String
  recipient    User @relation(fields: [recipientId], references: [id])
  channel      NotificationChannel
  templateCode String
  payload      Json
  relatedType  String
  relatedId    String
  dueAt        DateTime // when it SHOULD have been sent
  status       NotificationStatus @default(PENDING)
  attempts     Int @default(0)
  dispatchedAt DateTime?                          // lag = dispatchedAt - dueAt (Proof Panel)
  readAt       DateTime?
  acknowledgedAt DateTime?
  isCatchUp    Boolean @default(false)
  error        String?
@@index([status, dueAt])
@@index([recipientId, readAt])
}
modelOutboxEvent{
  id          String @id@default(uuid())
  type        String
  payload     Json
  createdAt   DateTime@default(now())
  processedAt DateTime?

--- PAGE 21 ---
@@index([processedAt, createdAt])
}
// ───────────── Reports & summaries ─────────────
modelCaseSummary{
  id            String @id@default(uuid())
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id])
  version       Int
  status        SummaryStatus@default(DRAFT)
  storageKey    String
  contentHash   String
  generatedAt   DateTime @default(now())
  generatedBy   ActorType @default(SYSTEM)
  acceptedById  String?                             // officer who finalised it
  finalisedAt   DateTime?
@@unique([applicationId, version])
}
// ───────────── Audit (tamper-evident) ─────────────
modelAuditLog{
  id            String @id@default(uuid())
  streamKey     String // APP:<id> | INST:<id> | SYS
  seq           Int
  applicationId String?
  application   Application? @relation(fields: [applicationId], references: [id])
  actorType     ActorType
  actorId       String?
  actorRole     Role?
  actionType    String // STAGE_TRANSITION | DEFICIENCY_REVERT | SLA_ESCALATION | ALERT_
  entityType    String
  entityId      String
  previousState String?
  newState      String?
  remarks       String?
  payload       Json
  payloadHash   String
  prevHash      String
  hash          String @unique
  createdAt     DateTime @default(now())
  signature     ActionSignature?
@@unique([streamKey, seq])
@@index([applicationId, createdAt])
}
modelActionSignature{
  id         String @id@default(uuid())
  auditLogId String @unique
  auditLog   AuditLog @relation(fields: [auditLogId], references: [id])
  userId     String
  method     SignatureMethod
  signedAt   DateTime
  challengeRef String?
}
modelAuditAnchor{
  id          String @id@default(uuid())
  anchorDate  DateTime@unique@db.Date
  rootHash    String
  streamCount Int

--- PAGE 22 ---
SQL to add in the ﬁrst migration (audit immutability):
9. API Conventions
REST + OpenAPI 3.1, versioned /api/v1, JSON, Zod-validated; Idempotency-Key header supported on all POST actions;
errors follow RFC 7807 (application/problem+json).
Optimistic concurrency: state-changing calls include the entity version; stale writes return 409.
Pagination: cursor-based; ﬁltering/sorting via whitelisted query params so saved dashboard views are shareable URLs.
Realtime: WebSocket namespaces /ws/alerts (per-user), /ws/dashboard (per-scope) emit application.updated,
sla.state_changed, escalation.raised, notification.created.
Webhooks (outbound): HMAC-signed, retried with backoff; event types listed in Section 7.6.
Demo-only endpoints (guarded by DEMO_MODE=true): POST /demo/advance-time {days} (moves the virtual clock and
triggers an immediate sweep), POST /demo/reset (restore seed snapshot), POST /demo/simulate-tamper (sandboxed), 
GET
/demo/proof-panel.
10. Monorepo Folder Structure
  createdAt   DateTime@default(now())
}
// ───────────── Demo support ─────────────
modelSystemClock{
  id            Int @id@default(1)
  offsetSeconds Int @default(0) // virtual time offset (DEMO_MODE only)
  demoMode      Boolean@default(false)
  updatedAt     DateTime@updatedAt
}
sql
CREATE OR REPLACEFUNCTIONaudit_logs_immutable()RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'audit_logs is append-only'; END; $$ LANGUAGE plpgsql;
CREATETRIGGERaudit_logs_no_updateBEFOREUPDATEORDELETEON"AuditLog"
FOR EACH ROWEXECUTEFUNCTION audit_logs_immutable();
-- App role: GRANT INSERT, SELECT ON "AuditLog" TO pravah_app;  (no UPDATE/DELETE)
text

--- PAGE 23 ---
11. Seed Data Speciﬁcation (deterministic — same data every run)
Use faker with a ﬁxed seed, plus hand-authored "story" records so the demo is predictable. Targets: 9 regions, ~60 institutions,
~150 applications, ~40 undertakings, ~120 tracked documents, plus a larger 5,000-record synthetic set loaded only for the
simulation/performance tests.
 
sih26262-pravah-aicte/
├ ── docker-compose.yml            # web, api, worker, postgres, redis, minio, clamav, mailpit, keycloak
├ ── .env.example
├ ── Makefile                      # make up | make seed | make demo | make test | make simulate
├ ── apps/
│   ├ ── web/                      # Next.js 15 (UI only)
│   │   └── src/app/
│   │       ├ ── (auth)/login/
│   │       ├ ── bureau-hq/        # Command Center, region map, bottlenecks, escalation feed
│   │       ├ ── regional-desk/    # RO queue, EVC board, workload & reassign
│   │       ├ ── my-work/          # Scrutiny / EVC / SAC-SHC officer inbox & action bar
│   │       ├ ── applications/[id] # Timeline, deficiencies, case summary, audit tab
│   │       ├ ── evc/              # Queue, calendar, committee, report intake
│   │       ├ ── compliance/       # Undertakings + document validity monitor
│   │       ├ ── institution/      # Pizza-tracker, deficiency responses, uploads, expiry calendar
│   │       ├ ── reports/          # R1–R6 + scheduler
│   │       ├ ── admin/            # Policy Configurator (workflow designer, SLA, escalation, templates, holidays)
│   │       ├ ── audit/            # Hash-chain viewer + Verify + tamper demo
│   │       └── proof-panel/      # Evaluation-criteria metrics (judge page)
│   ├ ── api/                      # NestJS
│   │   └── src/
│   │       ├ ── workflow/         # Module A: definition loader/validator, machine factory, transition service, guard
│   │       ├ ── sla/              # Module B: working-day calc, SLA state, analytics queries
│   │       ├ ── evc/              # Module C
│   │       ├ ── undertakings/     # Module D
│   │       ├ ── documents/        # Module E: upload, scan, extraction orchestration, verification
│   │       ├ ── notifications/    # Module F: rules, templates, delivery
│   │       ├ ── reports/          # Module F: R1–R6, case summary PDF
│   │       ├ ── audit/            # Hash-chain writer + verifier + anchoring
│   │       ├ ── auth/             # OIDC, RBAC, scope, step-up
│   │       ├ ── clock/            # Virtual clock service
│   │       ├ ── adapters/         # AICTE portal, identity, messaging, eSign, DigiLocker (mock + interface)
│   │       └── demo/             # Time travel, reset, proof panel
│   └── worker/                   # Sweeper, BullMQ processors, OCR/PDF jobs, daily anchor
├ ── packages/
│   ├ ── shared/                   # Zod schemas, DTO types, event names, constants
│   ├ ── workflow/                 # Pure TS: definition schema, validator, XState builder, rules wrapper (unit-testab
│   ├ ── db/                       # Prisma schema, migrations, scoped client, seed
│   └── ui/                       # SlaBadge, EscalationTimeline, PizzaTracker, RuleDiffModal, CaseSummaryModal …
├ ── tests/
│   ├ ── e2e/                      # Playwright: the demo script as an automated test
│   └── simulation/               # 365-day, 5,000-record deadline reliability simulation
└── docs/                         # OpenAPI export, ADRs, runbook, PPT assets, demo video script

--- PAGE 24 ---
Scenario (story record) State at seed time Used in
Institution A — New
Institution, Scrutiny+EVC
track
In SCRUTINY, SLA at ~60% Demo step 2 (revert)
Institution B — New
Institution, Scrutiny+EVC
track
In SCRUTINY, clean ﬁle Demo step 2 (clear → auto-
jump to EVC queue)
Institution C — EoA, Only
Scrutiny
AMBER (82% SLA) HQ dashboard ﬁlter
Institution D — Increase in
Intake, EVC+SAC/SHC
SAC_SHC_REVIEW, RED (112%) Escalation level 1
Institution E — Only EVC EVC scheduled, report due in 2 days EVC alerts
Institution F — Scrutiny ﬁle CRITICAL (131%) Escalation level 2 to
Bureau
Institution G APPROVED_WITH_UNDERTAKING — faculty-recruitment undertaking, due in 5 days Demo step 3 (time travel)
Institution H Barrier-free certiﬁcate undertaking, already 6 days overdue Breach path
Institution I Registered lease expiring in 28 days; renewal upload ready (sample PDF) Demo step 4
Institution J Lease expired 12 days ago, COMPLIANCE_DEFICIENT Expired-doc escalation
Institution K Fire-safety certiﬁcate renewed late (history shows catch-up alert) Audit & reporting
Institution L Deﬁciency reverted 9 days ago, response window nearly over Institution response
ladder
Edge cases Reassigned officer; holiday inside an SLA window; paused-SLA application; low-
conﬁdence OCR document; duplicate ﬁle hash across two institutions
Tests & Q&A
Also generate sample synthetic PDFs (lease deed, ﬁre certiﬁcate, evidence photos with EXIF) in docs/sample-docs/ — one clean,
one scanned/rotated (OCR), one with a mismatching date (ﬂag demo). All documents are synthetic and watermarked "SAMPLE –
NOT A REAL DOCUMENT".
Seeded users (password Demo@123, TOTP seed pre-shared for demo): hq.head, hq.officer, ro.south, ro.west,
scrutiny.south1, evc.lead1, sacshc.member1, inst.a … inst.l, auditor, admin.
12. Single-Phase Execution Plan (One Build, All Workstreams in Parallel)
There are no phases and no phase gates. Six people start at the same moment, work on one trunk, integrate continuously, and ﬁnish
together against one Deﬁnition of Done. Ordering inside a workstream follows technical dependency only; ordering between
workstreams is removed by contract-ﬁrst parallelism (12.3). The idea-submission PPT (Section 14) is produced by the same single
build — Workstream 6 drafts it from the ﬁrst minute and it is submitted as soon as it passes review, which should be well before 28
October.

--- PAGE 25 ---
12.1 Team ownership (6 members, each owns a vertical slice end-to-end)
ID Owner focus Owns (backend + UI + tests)
WS1 Workﬂow & Rules core packages/workflow, deﬁnition validator, XState builder, routing rules, transition service, revert/resubmit,
HITL guards, SLA working-day math (packages/workflow + apps/api/workflow, apps/api/sla),
workﬂow-deﬁnition tests
WS2 Platform, data & audit Monorepo scaffold, Docker Compose, Prisma schema + migrations + immutability trigger, scoped client,
auth/RBAC/step-up, audit hash-chain writer/veriﬁer/anchor, virtual clock, seed + simulation dataset, CI
pipeline
WS3 Scheduler, notiﬁcations &
escalation
Sweeper, nextAlertAt maintenance, escalation matrix execution, notiﬁcation rules/templates (EN/HI),
BullMQ delivery + retries + DLQ, WebSocket alerts, digest mode, Time-Travel endpoint, 365-day simulation
test
WS4 Compliance, documents &
reports
EVC scheduler logic, undertaking ledger, tracked-document register, upload/scan/extraction pipeline, officer
veriﬁcation, case summary PDF, reports R1–R6 + XLSX/PDF exports
WS5 Dashboards & officer
experience
Bureau HQ Command Center, Regional Desk, My Work, application detail/timeline, EVC board & calendar,
region map, bottleneck/workload charts, saved views
WS6 Institution portal, admin,
audit UI, proof &
presentation
Institution portal (pizza-tracker, deﬁciency responses, uploads, expiry calendar), Policy Conﬁgurator UI,
audit viewer + tamper demo, Proof Panel, Playwright demo-as-test, PPT, demo video, README, judge Q&A
deck
(With fewer than six people, merge WS5+WS6 UI work and WS3+WS4 backend work; nothing else changes because the
workstreams only touch each other through contracts.)
12.2 Workstream task lists (all run concurrently; "needs" = a contract, not another person's ﬁnished feature)
WS1 — Workﬂow & Rules core
1. Deﬁnition JSON schema + validator (reachability, dead ends, targets, terminal, statutory roles). Needs: none.
2. XState v5 machine builder from a deﬁnition; guard factory (role, scope, step-up, statutory ﬂag, system-actor ban). Needs:
validator.
3. Routing rules wrapper with ﬁred-rule capture and dry-run endpoint. Needs: none.
4. Transition service: single transaction = state change + stage history + audit event + outbox + nextAlertAt recompute. Needs:
audit service interface (contract from WS2).
5. Revert/resubmit/clariﬁcation ﬂows, deﬁciency items, SLA pause/resume. Needs: transition service.
6. Working-day calculator (holidays, regional holidays) + property-based tests with fast-check. Needs: none.
7. Author the 4 required deﬁnitions + 1 extra custom example (for the live "add a track" demo). Needs: validator.
8. Exhaustive transition-table tests; export the transition table as a Markdown/PNG for the PPT. Needs: deﬁnitions.
WS2 — Platform, data & audit
1. Monorepo + Docker Compose + Makeﬁle + .env.example; make up boots the full stack. Needs: none.
2. Prisma schema (Section 8) + migrations + audit immutability trigger + DB roles. Needs: none.
3. Auth: OIDC (Keycloak realm export), JWT, RBAC decorators, scope injection (scoped Prisma client), TOTP step-up endpoint.
Needs: schema.
4. Audit service: canonical JSON, per-stream advisory lock, chain write, verify endpoint, Merkle anchor job. Needs: schema.
5. ClockService + /demo/* guards. Needs: none.
6. Seed script (story records + faker set) and 5,000-record simulation seeder; make seed, make simulate. Needs: schema.
7. CI (typecheck, lint, unit, integration with Testcontainers, Playwright smoke) and auto-deploy of the live demo. Needs: scaffold.
8. Publish OpenAPI from the API; generate MSW mock handlers from Zod schemas for the UI workstreams (this is what removes
cross-team blocking). Needs: shared schemas.
WS3 — Scheduler, notiﬁcations & escalation
1. Notiﬁcation rule/template/delivery pipeline with dedupeKey, BullMQ retry, DLQ; Mailpit email, SMS logger, in-app WebSocket.
Needs: schema.
2. Sweeper (batch, FOR UPDATE SKIP LOCKED, catch-up logic, isCatchUp), heartbeat. Needs: schema + clock.

--- PAGE 26 ---
3. Escalation matrix executor (levels, acknowledgement-required re-notify). Needs: rules tables.
4. EN/HI template set for every event in the catalogue. Needs: none.
5. Time-Travel endpoint (advance-time + immediate sweep) and the UI control contract. Needs: clock.
6. 365-day simulation test with outage injection; Proof Panel metrics endpoint (alert lag, missed = 0, duplicates = 0). Needs:
sweeper + simulation seed.
7. Daily digest + weekly scheduled reports trigger. Needs: WS4 report endpoints (contract).
WS4 — Compliance, documents & reports
1. EVC scheduler: auto-queue on-enter action, priority score with breakdown, mode, committee, conﬂict check, reschedule history,
deadline ﬁelds. Needs: workﬂow onEnter contract.
2. Undertaking ledger: creation from condition library on approval, lifecycle, evidence upload, verify/reject, extension request,
breach + show-cause queue item. Needs: workﬂow onEnter contract.
3. Document vault: presigned upload, ClamAV scan, SHA-256, versioning, watermarked download. Needs: schema.
4. Extraction pipeline: RegexBaseline provider ﬁrst (offline, deterministic), then TesseractOCR, then optional GeminiFlash;
per-ﬁeld conﬁdence + source span; conﬁrm form API; cross-check ﬂags. Needs: vault.
5. Renewal ﬂow and expiry statuses, COMPLIANCE_DEFICIENT propagation. Needs: register.
6. Case Summary PDF (Puppeteer template, DRAFT watermark, content hash, ﬁnalise action). Needs: application read model.
7. Reports R1–R6 with XLSX + PDF export. Needs: aggregates.
8. Synthetic sample documents (clean, scanned, mismatching date, duplicate hash). Needs: none.
WS5 — Dashboards & officer experience
1. Design tokens, SlaBadge (colour + icon + text), layout shell, role-aware navigation, EN/HI toggle. Needs: none.
2. Bureau HQ Command Center: region map, funnel, bottleneck ranking, workload chart, Red/Critical feed, saved views. Needs:
aggregate API contract (MSW mocks).
3. Regional Desk: queue, escalations, reassign/delegate, EVC board. Needs: contract.
4. My Work: SLA-sorted inbox, action bar with statutory step-up modal, deﬁciency modal with reason codes and checklist. Needs:
action contract.
5. Application detail: stage timeline with durations, deﬁciency thread, documents tab, case summary modal, audit tab. Needs:
contract.
6. EVC calendar and committee assignment UI with conﬂict warnings. Needs: contract.
7. Live updates via WebSocket (optimistic UI + toasts). Needs: WS3 event contract.
WS6 — Institution portal, admin, audit UI, proof & presentation
1. Institution portal: pizza-tracker, deﬁciency checklist with per-item upload, undertaking cards with countdown, document
expiry calendar + .ics feed, notiﬁcation inbox. Needs: contract.
2. Lease upload screen with PDF viewer, highlighted clause, conﬁdence chips, officer conﬁrm form. Needs: WS4 extraction
contract.
3. Policy Conﬁgurator: workﬂow designer, SLA matrix, escalation matrix, template editor, holiday calendar, with diff + rollback +
dry-run impact. Needs: contract.
4. Audit viewer: ﬁlters, chain status, Verify chain, sandbox Simulate tampering. Needs: audit contract.
5. Proof Panel (judge page): alert on-time %, lag distribution, missed deadlines = 0, duplicate alerts = 0, audit chain veriﬁed,
manual follow-ups avoided, OCR override rate. Needs: WS3 metrics contract.
6. Playwright script = the demo (Section 13) so the demo is regression-tested.
7. PPT (Section 14), README, architecture/ER diagrams, 3–4-minute demo video (backup), judge Q&A cheat-sheet, one-page
"APH items still to conﬁrm" note.
12.3 Contract-ﬁrst parallelism (how nobody waits on anybody)
Authored by WS1 + WS2 as the ﬁrst items inside their own task lists (they are ordinary tasks, not a separate phase) and committed
to packages/shared:
1. Zod schemas / DTOs for every entity and endpoint.
2. Workﬂow deﬁnition JSON schema and the four tracks' deﬁnitions.
3. Event catalogue (names + payloads) used by notiﬁcations, WebSocket and webhooks.
4. Audit service interface (record(streamKey, event, actor)), Clock interface (now()), Notiﬁcation interface
(schedule(...)).

--- PAGE 27 ---
5. MSW mock handlers generated from the schemas, with the seed's story records as ﬁxtures.
Until a real endpoint exists, UI workstreams run against the mock handlers; switching a screen from mock to real is a one-line conﬁg
change, veriﬁed by the same Playwright test.
12.4 Continuous integration rhythm (not phases — just how work is merged)
Trunk-based development: short-lived branches, merge to main at least every two hours; CI must be green to merge
(typecheck, lint, unit tests, integration tests).
Always-demoable main: every merge auto-deploys to the live demo environment; a smoke Playwright test runs after deploy.
Contract changes require a PR touching packages/shared and tagging the affected workstream owners.
Daily 15-minute sync (or every ~8 hours in a continuous sprint): blockers, contract changes, next demo-script step to rehearse.
Rehearsal-driven ﬁnish: the demo script (Section 13) is run end-to-end by someone who did not build it; every failure becomes
a ticket. The build is done when the Deﬁnition of Done passes — not when a clock says so.
12.5 Dependency map (what can start immediately vs. what consumes a contract)
Workstream Starts at minute 0 on Consumes contract from
WS1 validator, working-day math, routing wrapper WS2 audit interface (mockable)
WS2 scaffold, schema, clock, audit none
WS3 templates, delivery pipeline, sweeper skeleton WS2 schema/clock; WS1 events
WS4 sample docs, vault, extractor baseline WS2 schema; WS1 onEnter hooks
WS5 design system, shell, charts with mocks WS2 MSW mocks; WS3 event names
WS6 portal screens with mocks, PPT, diagrams WS2 MSW mocks; WS3/WS4 contracts
12.6 Deﬁnition of Done (single checklist for the whole build)
Functional
 All four required tracks route correctly end-to-end, plus one admin-created track added live without redeploying.
 Revert/resubmit loop works with reason codes, checklist items, SLA pause/resume and institution notiﬁcation.
 Clearing scrutiny auto-queues the ﬁle for EVC; EVC schedule, committee, conﬂict check, reschedule and report intake work.
 Approval with undertaking creates ledger records; evidence upload → verify/reject → close; breach escalates and creates a show-
cause review item (no auto-penalty).
 Lease/certiﬁcate upload → extraction with highlighted source → officer conﬁrmation → deadlines set; renewal clears overdue state.
 Escalation matrix ﬁres at 75 / 100 / 125 % and acknowledgement-required re-notiﬁcation works.
 All six reports export to XLSX and PDF; Case Summary PDF generates as DRAFT and can be ﬁnalised by an authorised officer.
 Five role dashboards show only in-scope data; English/Hindi toggle works for UI and notiﬁcation templates.
Safeguards & quality
 "System tries to approve" test fails as designed; statutory actions need step-up + remarks + authorised human.
 Audit chain veriﬁes OK; sandbox tamper simulation is detected at the exact broken seq; UPDATE/DELETE on audit table is rejected
by the DB.
 RBAC scope test (every role × every endpoint) shows zero cross-scope leakage.
365-day simulation over 5,000 records: 0 missed alerts, 0 duplicate alerts; with a 24-hour simulated outage, all missed alerts are
sent once on restart.
 Dashboard p95 < 1 s at 50,000 applications; live update < 2 s.
 Uploads: infected test ﬁle quarantined, wrong MIME rejected, presigned URL expires.
 Accessibility check (axe) passes on the main screens; no information conveyed by colour alone.
Delivery
make up && make seed yields a working system on a clean machine in under 10 minutes.
 Live demo URL up; Reset Demo button restores the seed in < 30 s.
 Demo script passed twice end-to-end by someone who did not build it; Playwright version green in CI.
 PPT reviewed, official numbers traceable to APH or labelled "conﬁgurable", then submitted on the SIH portal.

--- PAGE 28 ---
 3–4 minute backup demo video recorded; README, architecture diagram, ER diagram and OpenAPI export in docs/.
13. The 6-Minute Judge Demo Script (also the Playwright E2E test)
Setup: two browser windows (Officer / Institution), Time-Travel control visible, Proof Panel in a third tab. Keep the Reset Demo
button handy. Backup: the 3–4 minute video.
1. The macro picture (30 s) — Bureau Head, National Command Center. Region map coloured by SLA health; open "Red &
Critical" saved view → 3 bottlenecked applications, 2 expired leases, 1 breached undertaking. Say: "One screen replaces the
follow-up calls and spreadsheets."
2. Handbook-as-data (45 s) — Admin, Policy Conﬁgurator. Show the SLA matrix; change one stage's duration, review the diff
and the dry-run impact ("turns 14 ﬁles amber today"), save. Then add a new custom track in the workﬂow designer. Say: "When
the APH changes, AICTE changes a setting, not code."
3. Routing, revert and auto-queue (75 s) — Scrutiny Officer. Open Institution A → Revert for Deﬁciency (reason code +
checklist) → SLA badge turns to Paused, audit entry appears, institution gets a notiﬁcation. Switch to the Institution window:
checklist visible, upload a clariﬁcation → ﬁle returns to Re-Scrutiny. Back as officer: Clear Institution B (a routine, non-statutory
action, so no step-up is needed) → the ﬁle jumps into the Regional EVC Queue with a visible priority-score breakdown.
4. Time-Travel escalation (75 s) — Institution G. Undertaking due in 5 days. Click Time Travel +6 days: sweeper runs, status ﬂips
to BREACHED_ESCALATED, email/in-app alert appears, the ﬁle lands in the RO's escalation queue with a Show-cause review item
awaiting a human decision. Open the Proof Panel: alert lag in seconds, duplicates = 0.
5. Smart lease renewal (60 s) — Institution I. Upload a renewed (scanned) lease PDF → malware scan → extraction with
highlighted clause, conﬁdence chips → officer conﬁrms (shows the amber low-conﬁdence ﬁeld being corrected) → new expiry
date set → overdue ﬂag cleared → reminder ladder reset.
6. The safeguard moment (45 s) — Regional Officer. Attempt APPROVE → step-up TOTP + remarks required; show the "system
tried to approve" test result from CI. Say: "Automation can route, remind and draft. Only an authorised human can decide."
7. Case Summary + audit (30 s). Generate the Electronic Case Summary (DRAFT badge) → ﬁnalise → open Audit Viewer →
Verify chain ✓ → toggle Simulate tampering → veriﬁcation fails at the exact entry.
8. Close (20 s) — Proof Panel. Show the evaluation-criteria scorecard: workﬂow accuracy tests green, alert timeliness, 0 missed
deadlines in the 365-day simulation, audit completeness.
13.1 Likely judge questions — prepared answers
Question Answer
How do you handle APH
changes every year?
Workﬂows, SLAs, thresholds, reminder offsets, document types and templates are versioned conﬁguration with
effective dates, diff, rollback and dry-run — no redeploy.
What if your server is down
when a deadline passes?
The sweeper derives due work from the database on every run and on boot; missed tiers are sent once with a catch-
up ﬂag. We simulate a 24-hour outage in the test suite.
Can the system approve or reject
an application?
No. Statutory actions are blocked for system actors and require an authorised human with step-up authentication
and remarks; this is enforced in the state machine and tested.
Why trust the AI/OCR dates? We don't — extraction is advisory with per-ﬁeld conﬁdence and the source clause highlighted; the officer's
conﬁrmed value drives deadlines, and override rate is tracked. A deterministic offline extractor is the default.
Is the audit trail really tamper-
proof?
It is tamper-evident: per-stream SHA-256 chains, DB-level append-only enforcement and a daily Merkle anchor
mean any edit or truncation is detected.
How will it integrate with
AICTE's existing portal?
Adapter interfaces with a documented REST/webhook contract, OIDC SSO, and a bulk Excel import so a Regional
Office can onboard its existing data immediately.
How does it scale? Stateless API/worker containers, indexed nextAlertAt queries (O(due items)), Redis queues, Postgres read
replicas if needed; tested on 50,000 applications.
Data protection? RBAC + scope enforcement, encrypted vault, short-lived signed URLs, watermarked downloads, India-resident
hosting path, DPDP-aligned retention; demo uses synthetic data.
What about languages and
accessibility?
English + Hindi UI and notiﬁcations, WCAG 2.1 AA / GIGW-aligned design, never colour-only status.
Where did your official numbers
come from?
Every official number is conﬁguration mapped from the APH; the placeholders in the prototype are labelled and
replaceable via the conﬁgurator.

--- PAGE 29 ---
14. Ready-to-Use SIH Idea Submission PPT Content
Open the official SIH 2026 template ﬁrst and map the content below to its headings (the usual headings are: Proposed Solution,
Technical Approach, Feasibility & Viability, Impact & Beneﬁts, Research & References). Where the template allows fewer slides,
merge Slides 2+3 and Slides 6+7. Keep text short on the slides themselves; the detail lives in this plan and the demo.
Slide 1 — Title & Proposed Solution
Problem Statement ID: SIH26262 | Title: Integrated AICTE Approval Workﬂow Automation, Compliance Monitoring and Alert
Management System
Solution:PRAVAH-AICTE — Platform for Regulatory Approval, Vigilance, Automation & Handbook Compliance
One-line concept: One conﬁgurable platform that routes approvals, watches every deadline, and escalates delays — while
leaving every statutory decision with the competent authority.
How it addresses the problem: replaces manual follow-up across Regional Offices and Bureaus with automated routing, SLA
clocks, EVC tracking, undertaking and lease/document monitoring, tiered escalation and a complete audit trail.
What makes it different:
Handbook-as-data: APH tracks, SLA days, thresholds and reminders are versioned conﬁguration, not code.
Deadlines that can't be missed: deterministic, idempotent sweeper with catch-up after downtime.
Safeguard enforced in code: system actors cannot take statutory decisions; humans need step-up authentication.
Slide 2 — Technical Approach: Modules A–F
A. APH Workﬂow Engine — versioned JSON deﬁnitions → XState machines; rule-based track assignment (Only Scrutiny,
Scrutiny+EVC, EVC+SAC/SHC, Only EVC, others); authorised revert with reasons.
B. SLA & Pendency Command Center — working-day SLA with pause/resume; Green <75 % / Amber 75–99 % / Red 100–124 %
/ Critical ≥125 %; role-based dashboards; bottleneck and workload analytics.
C. EVC Queue & Scheduler — auto-queue after scrutiny; Physical/Online/Hybrid; committee and conﬂict check; due/overdue
escalation.
D. Undertaking Ledger — conditional approvals become tracked records; evidence upload; officer veriﬁcation; breach
escalation to a human show-cause review.
E. Document Validity Monitor — lease/certiﬁcate register; AI-assisted extraction with highlighted source, human-conﬁrmed;
90/60/30/15/7-day renewal alerts (conﬁgurable).
F. Notiﬁcations, Escalation, Reports & Audit — event-driven alerts (in-app, email, SMS; English/Hindi), acknowledgement-
based escalation, six reports, hash-chained audit trail.
Slide 3 — Process Flow & Architecture
(Use the Section 4.1 diagram on the left and this ﬂow on the right.)
1. Intake → rules engine assigns track + SLA clock starts.
2. Stage routing → officer acts; auto-advance; deﬁciency loop pauses SLA and notiﬁes the institution.
3. EVC → auto-queue, schedule, track report; escalate delays.
4. Decision (human) → competent authority approves / approves with undertaking / rejects with step-up authentication.
5. Compliance → undertaking ledger and document watchers created automatically.
6. Vigilance → sweeper sends reminders and escalates overdue items; every event is written to the audit chain.
Slide 4 — Feasibility, Viability & Risks
Stack (all proven open-source): Next.js, NestJS, PostgreSQL, Redis/BullMQ, MinIO/S3, XState, Docker.
Working prototype: all modules, seeded with realistic synthetic data, one-command deployment.
Integration path: adapter layer + OpenAPI + webhooks + bulk Excel import; OIDC SSO.
Security & compliance path: RBAC with scope, encrypted vault, malware scan, DPDP-aligned retention, MeitY-
empanelled/NIC hosting with India data residency, third-party security audit before go-live.
Key risks → mitigations:

--- PAGE 30 ---
Risk Mitigation
APH rules change Handbook-as-data conﬁgurator with versioning and dry-run
Alert fatigue Digest mode, de-duplication, acknowledgement-based escalation
OCR/AI errors Advisory only; conﬁdence + source highlight; human conﬁrmation
Integration unavailability Adapters, bulk import, standalone operation
User adoption Excel onboarding, bilingual UI, role-focused screens
Slide 5 — Novelty, USP & Regulatory Safeguards
No-code APH Policy Conﬁgurator with diff, rollback and impact dry-run.
Crash-proof deadline engine: exactly-once alerts and catch-up after downtime, proven by a 365-day simulation.
Tamper-evident audit chain (per-stream SHA-256 + daily Merkle anchor + append-only database) for SAC/SHC appeals, RTI
and court queries.
Human-in-the-Loop enforced: statutory actions blocked for the system and require authorised human + step-up; every system-
generated artefact is labelled for veriﬁcation.
Explainability: every routing decision, priority score and extracted date shows why.
Slide 6 — Impact & Expected Outcomes (measurable, not guessed)
Less manual follow-up: every reminder/escalation that is auto-sent replaces a manual call or email — tracked by a live "follow-
ups avoided" counter and baselined in a pilot Region.
Fewer missed deadlines and expired documents: tiered alerts, institution-side calendars and escalations; target zero missed
alerts (demonstrated by simulation) and measurable reduction in lapsed undertakings/leases.
Faster, more transparent processing: stage-wise pendency, bottleneck ranking and workload balance visible to every
authorised level; institutions see live status.
Accountability: acknowledgement-tracked escalations and complete audit trail.
Better use of staff time: automation handles routing, reminders and draft summaries so officers focus on scrutiny and
decisions.
Evaluation-criteria scorecard: workﬂow accuracy · alert timeliness · deadline reliability · pending-case visibility · manual-effort
reduction · audit completeness (live Proof Panel).
Slide 7 — Research & References
AICTE Approval Process Handbook 2024-25 to 2026-27 and subsequent corrigenda (including the Dec-2025 corrigendum on
EVC/SAC constitution).
AICTE 2026-27 EoA/LoA and SAC/SHC report formats (stage and undertaking structure).
Digital Personal Data Protection Act, 2023; CERT-In directions; GIGW 3.0; WCAG 2.1; OWASP ASVS.
Technical references: XState (statecharts), json-rules-engine, BullMQ, PostgreSQL row-level security, RFC 7807, Merkle-tree
audit anchoring.

--- PAGE 31 ---
15. Risk Register (build + demo)
# Risk Likelihood Impact Mitigation / fallback
R1 Scope too large for the team Medium High Contract-ﬁrst parallelism; every item has a fallback (below); vertical slices
keep main demoable at all times
R2 OCR/LLM extraction ﬂaky on stage Medium Medium Default to deterministic RegexBaseline + curated sample PDFs; manual-
entry form always available
R3 Live network/Redis/SMTP failure
during demo
Medium High Docker Compose on a local laptop as hot spare; Mailpit local SMTP; 3–4-
minute backup video; Reset Demo button
R4 Time-travel logic corrupts demo state Low High Virtual clock offset only (no row edits); reset snapshot; Playwright regression
of the script
R5 Placeholder SLA numbers mistaken
for official ones
Medium Medium Visible "PLACEHOLDER" labels in admin UI; slide wording "conﬁgurable
per APH"; APH-conﬁrmation note
R6 Audit chain breaks under
concurrency
Low High Per-stream advisory locks, UNIQUE(streamKey, seq), concurrency test
with parallel writers
R7 Cross-region data leakage Low High Scoped Prisma client + RLS + role×endpoint leakage test in CI
R8 Timezone/DST/holiday errors in
deadlines
Medium Medium Store UTC, compute in Asia/Kolkata; property tests around
weekends/holidays; no DST in India but tests keep logic portable
R9 Alert fatigue judged as a weakness Medium Low Digest mode, dedupe, acknowledgement-based escalation shown in demo
R10 Idea cap (500) reached before
submission
Low–
Medium
High Submit the PPT as soon as reviewed; do not wait for the deadline day
R11 Judges ask about real AICTE
data/integration
High Medium Adapter diagram, bulk import demo, honest "mocked in prototype, contract
documented" answer

--- PAGE 32 ---
16. Acceptance Test Catalogue (what "works" means)
ID Test Pass criteria
T01 Track coverage Each of the 4 required tracks (+1 custom) completes from SUBMITTED to a terminal stage; illegal transitions return
409/422 and are audited
T02 Deﬁnition validator Dead-end, unreachable, missing-target, missing-terminal deﬁnitions are rejected and cannot be activated
T03 Revert & SLA
pause
After revert, officer SLA is paused; after resubmit, deadline = original + paused working time (property-tested)
T04 Working-day math Weekends, national and regional holidays are excluded; boundary cases (Fri→Mon, holiday on deadline) correct
T05 Statutory guard System actor, wrong role, wrong region, missing step-up, or missing remarks → rejected; correct human → accepted with
ActionSignature
T06 Sweeper exactly-
once
Run sweeper N times in parallel → exactly one notiﬁcation per dedupeKey
T07 Catch-up Stop worker for 24 simulated hours across several tiers → on restart each missed tier is sent once, isCatchUp=true, in
chronological order
T08 365-day simulation 5,000 records, clock advanced day by day: 0 missed, 0 duplicate alerts; dispatch lag ≤ one sweep interval
T09 Escalation chain 75 % → Level 0, 100 % → Level 1, 125 % → Level 2; unacknowledged escalation re-notiﬁes; acknowledgement stops the
loop
T10 EVC ﬂow Scrutiny clear → queue entry with priority breakdown; conﬂict-of-interest member blocked; reschedule requires reason;
report overdue escalates
T11 Undertaking ﬂow Create → alerts at conﬁgured offsets → evidence → verify/reject; overdue → BREACHED_ESCALATED and show-cause
queue item (not an issued penalty)
T12 Document ﬂow Extraction returns ﬁelds + conﬁdence + source span; officer override recorded; renewal resets ladder; expiry sets
COMPLIANCE_DEFICIENT
T13 Upload security EICAR test ﬁle quarantined; disallowed MIME rejected; oversized ﬁle rejected; presigned URL expires
T14 Audit chain Verify returns OK; direct SQL UPDATE/DELETE is rejected; sandbox tamper detected at exact seq; truncation detected
by anchor mismatch
T15 Audit coverage A test enumerates every state-changing endpoint and asserts an audit event is written
T16 RBAC scope Every role × every endpoint: no out-of-scope record is readable or writable
T17 Reports R1–R6 return correct aggregates against a known ﬁxture; XLSX/PDF open successfully
T18 Performance Dashboard aggregates p95 < 1 s at 50,000 applications
T19 Accessibility & i18n axe passes on main screens; Hindi templates render with no missing keys
T20 Demo script Playwright version of Section 13 passes against the seeded stack

--- PAGE 33 ---
Appendix A — Review Findings and Changes from v1
# v1 issue Severity v2 change
1 Assumed 4 Regional Offices and a 4-value Region enum; AICTE operates
more (Western, Southern, South Western, South Central, Central, Eastern,
North Western, Northern, North Eastern)
High
(factual)
Region table, seeded with all offices; map built from
data
2 Modelled SHC_Hearing → SAC_Appeal as two sequential stages; AICTE
reports use a combined SAC/SHC committee; SAC = Standing Appellate
Committee
High
(factual)
Single SAC_SHC_REVIEW stage with outcomes incl.
recommended with undertaking; labels conﬁgurable;
SHC expansion ﬂagged to conﬁrm
3 EVC described as RO-constituted; Dec-2025 corrigendum says Council-
constituted and Physical/Online/Hybrid
Medium EvcSchedule.mode, constitutedBy
(conﬁgurable)
4 Inconsistent thresholds (70 % amber in Module B vs 75 % in Module F) Medium One 75/100/125 threshold set, stored as
EscalationRule rows
5 Enum/track mismatch (EVC_PLUS_SAC_SHC vs
SCRUTINY_EVC_SHC_SAC; stages in text missing from AppStage) while
claiming "zero hardcoding"
High Stages are string keys from versioned
WorkflowDefinition; validator ensures
consistency
6 Tech-stack ambiguity (NestJS or FastAPI; PyMuPDF in a TS ﬁle; Next.js
API routes vs NestJS)
Medium Deﬁnitive stack and ADR table; all-TypeScript
monorepo; OCR in Node with provider interface
7 EVC auto-queue via DB trigger Medium Service-layer onEnter action in the same
transaction (testable, versioned with deﬁnition)
8 One delayed BullMQ job per deadline: lost on Redis ﬂush, duplicated on
redeploy, can't follow a virtual clock
High Deterministic idempotent sweeper + nextAlertAt
+ dedupeKey; BullMQ only for delivery
9 Time-Travel described as a button without a design High ClockService virtual clock, 
 /demo/advance-
time, simulation test
10 SLA ignored working days/holidays and pause mechanics (schema lacked
ﬁelds)
High Working-day calculator, holiday calendar,
slaPausedAt/TotalSec, property tests
11 Global hash chain (race conditions) and "tamper-proof" overclaim Medium Per-stream chain, advisory locks, canonical hashing,
DB immutability, Merkle anchor, veriﬁer; wording =
tamper-evident
12 HITL claimed but not enforced High Statutory ﬂag in deﬁnitions, system-actor ban, step-
up + remarks, ActionSignature, tests
13 Schema gaps: no conﬁg tables for the conﬁgurator, no notiﬁcation table, no
deﬁciency items, no document versions, no stage history, no committee
members, Institution.adminUserId @unique forced one user per
institution
High Full schema rewrite (Section 8)
14 Unsubstantiated claims ("70% reduction", "zero missed", "100% legal
traceability")
Medium Replaced by measurable metrics, simulation proof
and a live Proof Panel
15 OCR/LLM treated as authoritative ("eliminates fraudulent date entry") and
sends documents to an external API with no governance
Medium Advisory extraction, conﬁdence + source span, officer
conﬁrmation, provider interface with offline default,
data-governance section
16 Integration reduced to one sentence (PS lists it as a key requirement) Medium Adapter layer, OpenAPI, webhooks, bulk Excel
import, SSO
17 No security/compliance section (DPDP Act, CERT-In, GIGW, hosting,
malware scan, RLS)
High Section 7
18 No accessibility, bilingual, observability, backup, testing strategy Medium Sections 7.2, 7.4, 12, 16
19 Reports mentioned in the PS (6 report types) but not speciﬁed Medium R1–R6 speciﬁcation and exports

--- PAGE 34 ---
# v1 issue Severity v2 change
20 No traceability from PS requirements/evaluation criteria to features and
tests
High Section 3 matrix + scorecard + Proof Panel
21 Phased/time-boxed sprint by pairs and hour ranges that only summed to
~36 h and serialised work
Medium Single-phase, contract-ﬁrst parallel build (Section
12) with one Deﬁnition of Done
22 PPT lacked feasibility/risks and references slides and wasn't tied to the
template or the 500-idea cap
Medium Slides 4 and 7 added; template-mapping note;
submit-early guidance
23 Demo had no failure fallbacks and no proof of the claims Medium Backup video, local hot spare, reset button, Proof
Panel, Q&A prep (Section 13)
24 Official numbers presented as fact (SLA days, lease norms) without source Medium PLACEHOLDER labelling, "APH items to conﬁrm" list
(Section 2)
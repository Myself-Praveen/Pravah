--- PAGE 1 ---
Smart India Hackathon 2026 | PS ID: SIH26262
PRAVAH-AICTE
Platform for Regulatory Approval, Vigilance, Automation & Handbook Compliance
Executive Summary & Vision
AICTE processes thousands of institutional applications annually across 9 Regional Offices under the Approval
Process Handbook (APH)—covering Scrutiny, EVC, SAC/SHC, and time-bound undertakings. PRAVAH-AICTE
replaces manual follow-ups and spreadsheets with a configurable, event-driven, tamper-evident regulatory
automation platform.
Core Problem Addressed
Manual tracking of multi-stage APH application
movement across regions.
SLA breaches in EVC scheduling and Expert Visit
reporting.
Lapsed conditional undertakings and unmonitored
lease/document expiries.
Lack of cryptographic auditability for appellate
queries and RTI.
Core Design Principles
Handbook-as-Data: Rules, SLAs, and offsets are
versioned JSON configuration, not hardcoded logic.
Crash-Proof Sweeper: Deterministic database-
driven sweeper guarantees zero missed alerts.
Strict HITL Guard: Automation assists and routes,
but statutory decisions require human step-up auth.
Key Value Proposition
PRAVAH-AICTE combines a zero-code APH workflow engine, real-time pendency command center, automated
EVC queueing, undertaking compliance ledger, AI-assisted lease monitor, and a hash-chained audit trail into a
single unified platform.
PRAVAH-AICTE — SIH 2026 Master Execution Plan Slide 1 of 6

--- PAGE 2 ---
Technical Approach: Modules A through F
The platform is architected into six robust, decoupled modules built on Next.js 15, NestJS, PostgreSQL, Redis/BullMQ,
and XState v5.
A. APH Workflow Engine
Versioned JSON definitions generate XState state
machines. Handles dynamic track assignment (Only
Scrutiny, Scrutiny+EVC, EVC+SAC/SHC, Only EVC),
authorised deficiency reverts with structured reason
checklists, and automated case summary generation.
B. SLA & Pendency Command Center
Working-day SLA calculation with Holiday Calendar
support and pause/resume mechanics. Thresholds
(Green <75%, Amber 75-99%, Red 100-124%, Critical
≥125%) drive automated reminders and multi-tier
escalations.
C. EVC Queue & Scheduler
Auto-enqueuing post-scrutiny with transparent priority
scoring. Supports Physical, Online, and Hybrid modes
(per Dec-2025 corrigendum), conflict-of-interest
checks, scheduling calendars, and overdue escalation
tracking.
D. Undertaking & Compliance Ledger
Conditional approvals automatically generate tracked
undertaking records. Features secure evidence
uploads, officer verification workflows, and escalation
paths leading to show-cause review queues.
E. Document Validity Monitor
Tracks lease deeds, fire safety, and FDRs. Combines
deterministic regex extraction with OCR fallbacks,
requiring mandatory human confirmation before setting
expiry deadlines and flagging compliance deficits.
F. Notifications, Reports & Audit
Event-driven alerts across In-App, Email, and SMS
(EN/HI). Six comprehensive reports (R1–R6) with
XLSX/PDF exports, backed by a per-stream SHA-256
hash-chained immutable audit trail.
PRAVAH-AICTE — SIH 2026 Master Execution Plan Slide 2 of 6

--- PAGE 3 ---
Process Flow & System Architecture
End-to-end data flow ensures complete visibility from institutional submission to final statutory review.
Architecture Layers
Presentation: Next.js 15 App Router (Role-based portals for Institutions, Scrutiny Officers, EVCs, Regional
Desks, Bureau HQ, and Admin Configurator).
Backend & Workflow: NestJS (Fastify) with XState v5 workflow engine and json-rules-engine.
Asynchronous & State: Redis + BullMQ for reliable delivery, idempotent sweeper for deadline checks.
Storage & Security: PostgreSQL 16 (Prisma ORM, scoped clients), MinIO SSE-encrypted vault, ClamAV
malware scanning.
6-Step Core Lifecycle Flow
Step Action System Automation & Safeguard
1. Intake Application submission via portal/bulkimport. Rules engine assigns workflow track; SLA working-day clockstarts.
2. Routing Scrutiny officer reviews or reverts fordeficiency. Revert pauses officer SLA, opens institution checklist, notifiesinstantly.
3. EVC Inspection scheduling and reportsubmission. Auto-enqueues into Regional EVC queue; tracks visit andreport deadlines.
4. Decision Competent Authority statutory review. Strict HITL Guard: Blocked for system actors; requires humanstep-up auth + remarks.
5. Compliance Approval with conditional undertakings /lease checks. Undertaking ledger and document watchers initializedautomatically.
6. Vigilance Continuous monitoring and escalation. Idempotent sweeper triggers tiered reminders and audit logwrites.
PRAVAH-AICTE — SIH 2026 Master Execution Plan Slide 3 of 6

--- PAGE 4 ---
Feasibility, Viability & Risk Mitigation
PRAVAH-AICTE is built on proven enterprise open-source technologies, ensuring rapid deployment, high scalability, and
robust security.
Technical & Operational Viability
Tech Stack: Next.js, NestJS, PostgreSQL, Redis,
MinIO, Docker — entirely containerized via Docker
Compose (`make up`).
Integration Path: Standardized adapter layer,
OpenAPI 3.1 specs, webhooks, and Excel bulk-
import templates for legacy onboarding.
Security & Hosting: Designed for MeitY-
empanelled / NIC cloud with India data residency,
RLS data scoping, and DPDP Act alignment.
Risk Register & Mitigations
APH Rule Changes: Mitigated by the No-Code
APH Policy Configurator with versioning and dry-run
impact simulation.
Alert Fatigue: Mitigated by officer daily digests,
deduplication keys, and acknowledgement-based
escalation loops.
OCR Extraction Errors: Mitigated by treating AI
extraction as advisory with confidence scores and
source highlighting; officer confirmation is
mandatory.
Scalability & Performance Targets
Tested for dashboard aggregates of p95 < 1s across 50,000 synthetic applications. Indexed `nextAlertAt` queries
ensure $O(\text{due items})$ database performance, easily handling peak annual approval loads.
PRAVAH-AICTE — SIH 2026 Master Execution Plan Slide 4 of 6

--- PAGE 5 ---
Novelty, USP & Regulatory Safeguards
What sets PRAVAH-AICTE apart is its uncompromising balance between deep automation and regulatory accountability.
Key Innovations & USPs
Handbook-As-Data Configurator: Update APH
rules, SLAs, and templates instantly without code
deployments.
Crash-Proof Deadline Engine: Deterministic
sweeper with catch-up logic; survives server
crashes and 24-hour outages with zero missed
alerts.
Transparency & Explainability: Every routing
track, priority score, and extracted lease date
exposes its decision rationale.
Enforced Regulatory Safeguards
Human-in-the-Loop (HITL): State machine
physically blocks system actors from taking
statutory actions. Approvals require authorized
human login + TOTP step-up + remarks.
Tamper-Evident Audit Trail: Per-stream SHA-256
hash chains with DB-level immutable triggers and
daily Merkle root anchoring. Detects any record edit
or truncation.
Live Evaluation Proof Panel
Includes a dedicated Proof Panel view for evaluators to verify alert timeliness, missed-deadline counts (=0), audit
chain validity, and SLA statistics in real-time during the demo.
PRAVAH-AICTE — SIH 2026 Master Execution Plan Slide 5 of 6

--- PAGE 6 ---
Impact, Outcomes & References
Measurable operational transformation for AICTE Regional Offices and Bureaus.
Measurable Impact & Benefits
Elimination of Manual Follow-Up: Automated
reminders and escalation ladders replace manual
calls and spreadsheets (tracked via "follow-ups
avoided" counter).
Zero Missed Expiries & Breaches: Proactive
tiered countdowns ensure 100% compliance on
undertakings and lease renewals.
Optimal Staff Utilization: Administrative routing
and draft summaries free officers to focus strictly on
regulatory scrutiny.
Evaluation Scorecard Alignment
✓  Workflow Accuracy (Golden-path tested)
✓  Timeliness of Alerts (Measured lag < sweep
window)
✓  Deadline Reliability (365-day simulation verified)
✓  Pending Case Visibility (HQ Command Center)
✓  Complete Audit Trail (Hash-chained verification)
Research & Compliance References
[1] AICTE Approval Process Handbook (APH) 2024-25 to 2026-27 & Corrigenda.
[2] Digital Personal Data Protection Act (DPDP) 2023; GIGW 3.0 & WCAG 2.1 AA.
[3] XState Statecharts, BullMQ Distributed Queues, RFC 7807, and Merkle Tree Anchoring.
PRAVAH-AICTE — SIH 2026 Master Execution Plan Slide 6 of 6
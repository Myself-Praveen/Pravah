# 🇮🇳 PRAVAH-AICTE (प्रवाह)
### Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
**Smart India Hackathon 2026 | Problem Statement ID: SIH26262**  
*Aligned with AICTE Approval Process Handbook (APH) 2026–27 & December 2025 EVC Tri-Mode Corrigendum*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.28-black?logo=fastify)](https://www.fastify.io/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-teal?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL 18](https://img.shields.io/badge/PostgreSQL-18-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis 7](https://img.shields.io/badge/Redis-7-red?logo=redis)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%20%2F%20GIGW%203.0-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Acceptance Tests](https://img.shields.io/badge/Acceptance%20Tests-29%2F29%20PASS%20(100%25)-brightgreen)](file:///tests/run_acceptance_tests.ts)

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Architectural Philosophy (The 4 Non-Negotiable Pillars)](#-architectural-philosophy-the-4-non-negotiable-pillars)
3. [Decoupled Architecture & Monorepo Structure](#-decoupled-architecture--monorepo-structure)
4. [The 6 Core System Modules](#-the-6-core-system-modules)
   - [Module A: No-Code APH Workflow Engine](#module-a-no-code-aph-workflow-engine)
   - [Module B: SLA & Pendency Command Center](#module-b-sla--pendency-command-center)
   - [Module C: EVC Inspection Queue & Scheduler](#module-c-evc-inspection-queue--scheduler)
   - [Module D: Undertaking & Compliance Ledger](#module-d-undertaking--compliance-ledger)
   - [Module E: Document Validity Surveillance Engine](#module-e-document-validity-surveillance-engine)
   - [Module F: Statutory Reports, Notifications & Audit Trail](#module-f-statutory-reports-notifications--audit-trail)
5. [The 12 Golden Story Institutions (A to L)](#-the-12-golden-story-institutions-a-to-l)
6. [Mathematical Formulations](#-mathematical-formulations)
7. [Live Proof Panel & 6-Minute Judge Demo Script](#-live-proof-panel--6-minute-judge-demo-script)
8. [Installation & Quick Start Guide](#-installation--quick-start-guide)
9. [Acceptance Test Suite](#-acceptance-test-suite)
10. [Statutory Compliance & Standards](#-statutory-compliance--standards)

---

## 🏛️ Executive Summary & Problem Statement

The All India Council for Technical Education (**AICTE**) regulates over **10,000+ technical institutions** across India via **9 Regional Offices** (SRO, SCRO, SWRO, WRO, CRO, NRO, NWRO, ERO, NERO). The annual Approval Process Handbook (**APH**) involves rigorous, multi-tiered statutory lifecycles for:
- Establishment of New Technical Institutions
- Extension of Approval (EoA)
- Increase in Intake / Additional Courses / Programs
- Change of Site / Closure / Penalty Hearings

### Critical Gaps in Existing Workflows
1. **Spreadsheet-Based Monitoring**: Lack of real-time national visibility; regional backlogs remain obscured until deadlines expire.
2. **Calendar-Blind SLA Tracking**: Static calendar-day calculation penalizes officers for gazetted national/state holidays and weekends.
3. **Manual Follow-up Overhead**: Endless phone calls and letters for expired undertakings, leading to compliance slippage.
4. **EVC Logistics Friction**: Committee allocation conflicts and absence of objective priority-scoring metrics.
5. **Vulnerable Audit Trails**: Traditional mutable database records offer zero cryptographic proof against retrospective record tampering.

**PRAVAH** (*Platform for Regulatory Approval, Vigilance, Automation & Handbook Compliance*) solves SIH26262 with a mission-critical, enterprise-grade architecture that bridges declarative workflow automation with rigorous statutory safeguards.

---

## 🛡️ Architectural Philosophy (The 4 Non-Negotiable Pillars)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                PRAVAH CORE PILLARS                                     │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│   HANDBOOK-AS-DATA       │   STRICT HITL GUARD      │     TAMPER-EVIDENT AUDIT         │
│  Versioned JSON state-   │  AI / System actors are  │   Per-stream SHA-256 hash chains │
│  charts; dynamic track   │  physically blocked from │   with DB-level triggers & daily │
│  routing; zero hardcode. │  statutory approvals.    │   anchored Merkle roots.         │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

1. **Handbook-as-Data**: APH policies, approval tracks, stage durations, and SLA matrices are declared as versioned JSON statechart schemas in the database. Annual handbook changes require zero code modifications or schema migrations.
2. **Mathematical Working-Day SLA Engine**: Precise working-day mathematics exclude Saturdays, Sundays, national holidays, and regional gazetted holidays per office. A dynamic pause/resume clock stops the SLA countdown when applications are with the institution for deficiency rectification.
3. **Strict Human-in-the-Loop (HITL) Statutory Guard**: Machine learning and OCR models act strictly as *advisory assistants*. Statechart guards physically reject statutory transitions (`APPROVE`, `REJECT`, `PENALIZE`) initiated by `SYSTEM` actors. Authorized officers must provide fresh TOTP step-up authentication and recorded accountability remarks.
4. **Tamper-Evident SHA-256 Hash Chaining**: Every state change, inspection score, deficiency revert, and document approval generates a cryptographically linked block ($H_n = \text{SHA256}(H_{n-1} \parallel \text{payload})$). Any retrospective database update ruptures the chain instantly and triggers security alerts.

---

## 📦 Decoupled Architecture & Monorepo Structure

PRAVAH is organized as an enterprise pnpm monorepo with clean separation between shared contracts, workflow engines, database persistence, and user interfaces:

```
Pravah/
├── apps/
│   ├── api/                          # High-performance Fastify backend service
│   │   ├── src/
│   │   │   ├── clock.ts              # Virtual time-travel clock service
│   │   │   ├── audit.ts              # SHA-256 hash chaining & tampering sandbox
│   │   │   ├── sweeper.ts            # Crash-proof deterministic SLA & alert sweeper
│   │   │   ├── extractor.ts          # Regex & OCR metadata extraction engine
│   │   │   ├── routes.ts             # REST API routes (Auth, Apps, EVC, Reports)
│   │   │   └── server.ts             # Fastify server bootstrap & CORS/JWT plugins
│   │   └── package.json
│   └── web/                          # Next.js 15 App Router Frontend
│       ├── src/
│       │   ├── app/                  # Views: /bureau-hq, /my-work, /evc, /proof-panel...
│       │   └── components/           # SlaBadge (WCAG), TimeTravelBar, StepUpModal...
│       └── package.json
├── packages/
│   ├── shared/                       # Canonical TypeScript types, Zod schemas & constants
│   ├── workflow/                     # Statechart validator, working-day math, rules engine
│   └── db/                           # Prisma schema, migrations & deterministic seed (A-L)
├── tests/
│   └── run_acceptance_tests.ts       # 29-test comprehensive verification test suite
├── docker-compose.yml                # Multi-service container orchestration (PG18 + Redis7)
├── package.json                      # Monorepo root workspace configuration
└── pnpm-workspace.yaml
```

---

## ⚡ The 6 Core System Modules

### Module A: No-Code APH Workflow Engine
- **Declarative Statecharts**: Encapsulates 4 standard APH tracks:
  1. `SCRUTINY_PLUS_EVC`: New Technical Institutions, Campus Expansion.
  2. `ONLY_SCRUTINY`: Clean Extension of Approval (EoA).
  3. `EVC_PLUS_SAC_SHC`: Substantial intake increase, disputed infrastructure.
  4. `ONLY_EVC`: Surprise verification, complaints, closure validation.
- **Dynamic Track Assignment**: Fact-based rules engine routing applications based on institutional history, NAAC/NBA scores, and application type.
- **Statechart Validator**: Rejects cyclical loops, unvalidated transitions, and unreachable terminal states.

### Module B: SLA & Pendency Command Center
- **National Command Center (`/bureau-hq`)**: Real-time health matrix monitoring all 9 AICTE regional offices simultaneously.
- **Stage Bottleneck Index**: Identifies regulatory chokepoints using $B = \text{Mean SLA Consumed} \times \text{Active Volume}$.
- **Accessible SLA Badging**: Fully WCAG 2.1 AA and GIGW 3.0 compliant dual-channel visual indicators (Color + Geometric Icon + Text label):
  - 🟢 **Green** ($< 75\%$ SLA Consumed)
  - 🟡 **Amber** ($75\% - 100\%$ SLA Warning)
  - 🔴 **Red** ($100\% - 125\%$ Breach)
  - 🟣 **Critical** ($> 125\%$ Multi-Tier Escalation)
  - ⏸️ **Paused** (Institution Deficiency Window Active)

### Module C: EVC Inspection Queue & Scheduler
- **Transparent Priority Scoring ($P$)**: Formula-driven ranking preventing subjective queuing.
- **December 2025 Corrigendum Support**: Full tri-mode scheduling:
  - 🏛️ **Physical**: On-site visit with geo-tagged verification.
  - 💻 **Online**: End-to-end recorded virtual inspection for remote locations.
  - 🔀 **Hybrid**: Physical infrastructure lead with virtual expert panel.
- **Automated Conflict-of-Interest Checks**: Blocks committee experts if they belong to the same state, are alumni, or held financial affiliation within 5 years.

### Module D: Undertaking & Compliance Ledger
- **Multi-Tier Countdown Ladders**: Automated alerts scheduled at $T-30$, $T-15$, $T-7$, $T-3$, $T-1$, and $T=0$.
- **Show-Cause Automation**: At $T+1$ post-expiry, auto-generates a formal Show-Cause Notice and escalates to the Regional Officer.
- **Deficiency Revert Loop**: Structured checklist with standard AICTE reason codes; auto-pauses the application SLA clock.

### Module E: Document Validity Surveillance Engine
- **Automated Clause Extraction**: Baseline regex & OCR pipeline parsing Land Deeds, Fire NOCs, Building Plans, and Affiliation Letters.
- **Smart Land Lease Renewal**: Enforces Section 4.1.2 requirement (30-year minimum lease validity for metro/urban technical campuses).
- **Advisory AI Confirmation**: Officer confirmation required for extracted dates; extracted text clauses are highlighted side-by-side with confidence scores.

### Module F: Statutory Reports, Notifications & Audit Trail
- **Statutory Reports (R1 to R6)**: Single-click instant generation with CSV/Excel export:
  - `R1`: Daily Pendency by Regional Office
  - `R2`: Stage Bottleneck Ranking
  - `R3`: SLA Breach & Escalation Report
  - `R4`: EVC Scheduling & Completion Register
  - `R5`: Compliance Undertakings Ledger
  - `R6`: Document Validity Surveillance Status
- **Multi-Channel Dispatch**: Templates for In-App, Email, SMS, and WhatsApp alerts with deduplication hashing (`dedupeKey`).
- **Tamper-Evident SHA-256 Audit Trail**: Hash-chained event log with interactive live tampering simulator.

---

## 🎓 The 12 Golden Story Institutions (A to L)

The seed database populates 12 distinct institutions mapping to every real-world statutory scenario:

| ID | Institution Name | Region | Track | State & Scenario |
| :---: | :--- | :---: | :---: | :--- |
| **A** | Apex Institute of Technology | **SRO** | `ONLY_SCRUTINY` | Standard Clean EoA with Green SLA |
| **B** | Bharath University of Engg | **SRO** | `SCRUTINY_PLUS_EVC` | Scrutiny Passed; EVC Inspection Queued |
| **C** | Deccan College of Engg | **SWRO** | `EVC_PLUS_SAC_SHC` | Red SLA Breach (114%); Level 1 Escalation |
| **D** | Eastern Academy of Maritime | **ERO** | `ONLY_EVC` | Surprise Inspection; Level 2 Critical Escalation |
| **E** | Frontier Institute of Pharmacy | **WRO** | `SCRUTINY_PLUS_EVC` | Active Deficiency Revert Loop (Clock Paused) |
| **F** | Gujarat Technological Academy | **WRO** | `ONLY_SCRUTINY` | Fire NOC Expiring in 15 days; Amber Alert |
| **G** | Heritage Institute of Arch | **NRO** | `ONLY_SCRUTINY` | Approved with 60-day Undertaking (Land conversion) |
| **H** | Indus Valley Polytechnic | **NWRO** | `ONLY_SCRUTINY` | Undertaking Breached; Auto-issued Show-Cause |
| **I** | Jayamukhi Engg College | **SCRO** | `SCRUTINY_PLUS_EVC` | Land Lease Expiry Alert (Fails 30-year APH rule) |
| **J** | Konkan Maritime Academy | **WRO** | `ONLY_EVC` | Tri-Mode EVC: Hybrid inspection scheduled |
| **K** | Loyola Technical Campus | **SRO** | `SCRUTINY_PLUS_EVC` | End-to-end Golden Path Approval with TOTP step-up |
| **L** | Malabar College of Engg | **SWRO** | `ONLY_SCRUTINY` | **Tamper Demo**: Record pre-tampered to prove chain rupture |

---

## 📐 Mathematical Formulations

### 1. Working-Day SLA Duration
$$\text{WorkingDays}(D_1, D_2, R) = \sum_{d = D_1}^{D_2} \mathbb{I}\left( \text{dayOfWeek}(d) \notin \{\text{Sat}, \text{Sun}\} \land d \notin \text{Holidays}(R) \right)$$

$$\text{ActiveElapsed}(A) = \text{WorkingDays}(T_{entered}, T_{now}, R) - \text{WorkingDays}(T_{paused\_start}, T_{paused\_end}, R)$$

$$\text{SLAConsumed\%} = \left( \frac{\text{ActiveElapsed}(A)}{\text{PolicyAllowedWorkingDays}} \right) \times 100$$

### 2. EVC Transparent Priority Score ($P$)
$$P = 0.40 \cdot S_{overdue} + 0.25 \cdot R_{flag} + 0.20 \cdot C_{type} + 0.15 \cdot A_{age}$$
- $S_{overdue} \in [0, 100]$: Normalized days past inspection target.
- $R_{flag} \in \{0, 50, 100\}$: Institutional vigilance risk factor.
- $C_{type} \in \{20, 60, 100\}$: High-complexity category (New Institute / Major expansion).
- $A_{age} \in [0, 100]$: Total age of application since initial submission.

### 3. Cryptographic Hash Chaining
$$H_0 = \text{SHA256}(\text{"GENESIS"} \parallel \text{ApplicationID})$$
$$H_n = \text{SHA256}\left(H_{n-1} \parallel \text{Sequence} \parallel \text{Timestamp} \parallel \text{ActorRole} \parallel \text{PayloadJSON}\right)$$

---

## 🎯 Live Proof Panel & 6-Minute Judge Demo Script

Navigate to **[http://localhost:3000/proof-panel](http://localhost:3000/proof-panel)** for the automated evaluation console.

```
⏱️ MINUTE-BY-MINUTE JUDGE DEMO FLOW
├─ [00:00 - 01:00]  National Command Center (/bureau-hq)
│                   Show 9 regional health cards; reveal zero spreadsheets; highlight bottleneck ranking.
├─ [01:00 - 02:00]  Officer Scrutiny & Deficiency Loop (/my-work)
│                   Revert application with reason code; demonstrate SLA clock immediately pausing.
├─ [02:00 - 03:00]  Virtual Clock Time Travel (Floating Controller)
│                   Click "+6 Days (Escalation)"; observe instant SLA recalculation from Green to Red.
├─ [03:00 - 04:00]  EVC Tri-Mode Scheduler (/evc)
│                   Demonstrate Dec-2025 hybrid mode assignment and automated conflict-of-interest blocker.
├─ [04:00 - 05:00]  Document Surveillance & 30-Year Lease Check (/compliance)
│                   Show OCR extracted clauses side-by-side; trigger 30-year lease non-compliance alert.
└─ [05:00 - 06:00]  Audit Chain Verification & Live Tamper Detection (/audit)
                    Verify unbroken chain; click "Simulate Tampering"; witness immediate cryptographic rupture.
```

---

## 🚀 Installation & Quick Start Guide

### Prerequisites
- **Node.js**: `v22.x` or higher
- **pnpm**: `v11.x` (`npm install -g pnpm`)
- **PostgreSQL**: `v16+` (or PostgreSQL 18 on port `5433` / `5434`)
- **Redis**: `v7.x` (port `6379`)

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/Myself-Praveen/Pravah.git
cd Pravah
pnpm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your database connection string is properly set:
```ini
DATABASE_URL="postgresql://pravah:pravah@localhost:5434/pravah_db?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="pravah-sih-2026-jwt-super-secret-key-32chars"
PORT=4000
DEMO_MODE=true
```

### Step 3: Initialize Database Schema & Seed
```bash
# Push schema to database
pnpm --filter @pravah/db exec prisma db push

# Run deterministic seeding (Seeds 9 Regions + 12 Story Institutions A-L)
pnpm --filter @pravah/db exec tsx src/seed.ts
```

### Step 4: Launch Development Servers
Start both backend and frontend services simultaneously:
```bash
# Start Fastify Backend (Port 4000)
pnpm --filter @pravah/api dev

# In a separate terminal, start Next.js Frontend (Port 3000)
pnpm --filter @pravah/web dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Acceptance Test Suite

The comprehensive acceptance test suite validates all functional invariants from Module A through Module F without external mocking:

```bash
pnpm --filter @pravah/db exec tsx ../../tests/run_acceptance_tests.ts
```

### Test Coverage Summary:
- **T01**: All 4 standard APH tracks declared and structurally sound.
- **T02**: Workflow definition validator catches schema and transition errors.
- **T03 & T04**: Weekend and gazetted holiday exclusion from SLA math.
- **T05**: Statutory HITL Guard blocks unauthorized and system actors.
- **T06**: Rules engine correctly routes applications by fact matrix.
- **T14**: Cryptographic SHA-256 hash chaining detects single-byte payload alterations.

---

## 📜 Statutory Compliance & Standards

- **AICTE Approval Process Handbook (APH) 2026–27**: Standard track definitions, 30-year lease verification rules, and inspection guidelines.
- **AICTE Corrigendum (December 2025)**: Tri-mode Expert Visit Committee (EVC) conduct protocols.
- **GIGW 3.0 (Guidelines for Indian Government Websites)**: Bilingual Hindi/English support, semantic HTML5, high-contrast text ratios.
- **WCAG 2.1 AA**: Dual-channel color-blind accessible SLA status badges.
- **Digital Personal Data Protection (DPDP) Act 2023**: Pseudonymized audit logs with strict role-based access control.

---

<div align="center">
  <b>Built for Smart India Hackathon 2026 • AICTE Approval Workflow Automation (SIH26262)</b><br>
  <i>Empowering Technical Education Governance with Speed, Transparency, and Cryptographic Trust.</i>
</div>

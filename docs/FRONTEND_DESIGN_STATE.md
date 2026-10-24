# PRAVAH-AICTE — Frontend Design & State Description

## 1. Tech Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 3.4 (custom AICTE palette)
- lucide-react icons, clsx/tailwind-merge
- Shared package: `@pravah/shared` (types, constants, reason codes)
- Backend: Fastify on `NEXT_PUBLIC_API_URL` (default http://localhost:4000/api/v1)

## 2. Roles (9)
INSTITUTION_ADMIN, SCRUTINY_OFFICER, EVC_MEMBER, SAC_SHC_MEMBER, REGIONAL_OFFICER, BUREAU_OFFICER, BUREAU_HEAD, AUDITOR, SYSTEM_ADMIN.

## 3. Routes (12 + landing)
`/` (landing), `/bureau-hq`, `/regional-desk`, `/my-work`, `/evc`, `/compliance`, `/institution`, `/admin`, `/reports`, `/audit`, `/proof-panel`, `/applications/[id]`.

## 4. Modules
A No-Code APH Workflow Engine, B SLA & Pendency Command Center, C EVC Inspection Queue & Scheduler, D Undertaking & Compliance Ledger, E Document Validity Surveillance, F Statutory Reports, Notifications & Audit Trail.

## 5. Design Tokens
- Primary: aicte-blue #1E3A8A (dark #0F172A), accent #2563EB
- Semantic SLA: Green #059669 (on track), Amber #D97706 (at risk), Red #DC2626 (breached), Critical (pulsing red)
- Government tricolor strip (saffron/white/green) at top of every page
- Typography: system sans, tabular-nums for SLA timers
- Shadows: card, elevated, glow; radii 2xl/3xl
- Motion: fade-in, slide-up, pulse-slow

## 6. State Management
- No global store; per-page `useState` + window events (`time-travel-updated`) + direct fetch
- Recommended: React Query for server state, AppContext for UI (lang, role, user)
- All fetches use `NEXT_PUBLIC_API_URL` via `lib/api.ts`

## 7. Accessibility (GIGW 3.0 / WCAG 2.1 AA)
- Keyboard navigable, ARIA labels, focus rings, skip links, bilingual EN/HI
- Color contrast >= 4.5:1, screen-reader friendly tables

## 8. Security
- Strict HITL: AI assists only; statutory approvals require officer step-up auth + TOTP + remarks
- Audit trail: per-stream SHA-256 hash chains, DB triggers, Merkle anchoring

## 9. Landing Page
Marketing/entry page with hero, problem statement, 6 modules, 4 pillars, role entry grid, trust badges.

# AI Prompt — Redesign PRAVAH-AICTE Frontend + Landing Page

You are a senior frontend engineer. Redesign the PRAVAH-AICTE Next.js 15 app (apps/web) and add a new landing page.

## Context
AICTE approval workflow automation. 9 roles, 12 routes, 6 modules (A–F). APH 2026-27. Strict HITL. GIGW 3.0 / WCAG 2.1 AA. Bilingual EN/HI.

## Tasks
1. Apply design tokens (aicte-blue, gov tricolor, SLA semantic colors) via tailwind.config.ts + globals.css.
2. Create shared UI components: StatCard, PageHeader, EmptyState, LoadingSpinner in components/ui.
3. Create AppContext (lang, role) provider in contexts/AppContext.tsx; wrap in layout.
4. Create lib/api.ts using NEXT_PUBLIC_API_URL.
5. Redesign layout.tsx: tricolor strip, sticky header, role switcher, language toggle, mobile menu, footer.
6. Redesign all 12 pages with consistent PageHeader, StatCard, card/table styling, loading/empty states.
7. Create landing page (/) with hero, problem, modules, pillars, role entry grid, trust badges.
8. Preserve all existing fetch/state logic and window events.

## Constraints
- Keep TypeScript strict; build must pass (`pnpm --filter @pravah/web build`).
- No new heavy dependencies.
- Maintain bilingual labels.
- All fetches via lib/api.ts base URL.

# EFCE UI — Project Report

## Overview
EFCE UI is a **production-ready, frontend-only** SaaS-style dashboard built with Next.js (App Router). It showcases incident analysis, risk management, causal graph editing, counterfactual simulation, reports, and a polished UI/UX with testing, Storybook, and CI.

## Tech Stack
**Core**
- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5

**UI & Design**
- shadcn/ui + Radix UI
- Tailwind CSS 4
- Lucide Icons

**Data & State (frontend-only)**
- localStorage for persistence
- Mock data modules in src/lib/mock
- API client stub: src/lib/api/client.ts

**Visualization**
- React Flow 11 (graph editor)
- Recharts 3 (charts)

**Testing & Quality**
- Playwright E2E
- Storybook 10.2.6 with a11y + docs + vitest addons
- Storybook interaction (play) tests
- ESLint + TypeScript strict

**Tooling / Build**
- Turbopack (Next dev)
- Bundle analyzer (ANALYZE=true)
- GitHub Actions CI

**PWA / Offline**
- Manifest + service worker registration
- Offline banner for UX feedback

---

## Features Implemented
### Navigation & Shell
- Global **Command Palette** (Ctrl+K)
- Active route highlighting in sidebar
- Responsive sidebar (mobile drawer)
- Optional breadcrumbs in Topbar
- Skip-to-content accessibility

### Notifications
- Toasts for actions
- Notification drawer (bell icon)
- Mark-as-read + unread indicator

### Reports
- List + preview layout
- Filters: type, date range, tags, search
- Templates gallery
- “Generate report” wizard (frontend only)
- Preview loading/empty/error states

### Risk Registry
- Table list with drawer details
- Status timeline
- Mitigation controls
- Add action modal

### Graph Studio
- Node/edge editor with add/remove
- Edge confidence slider
- Evidence notes panel
- Local versioning (localStorage)

### Counterfactual Lab
- Scenario builder with toggles + sliders
- Scenario A vs B comparison
- Delta chart vs baseline
- Save/load scenarios (localStorage)

### Incidents
- Filters + search
- Generate demo incident button
- localStorage persistence

### Settings
- Theme toggle
- Report defaults
- Keyboard shortcuts toggle
- Export defaults (format + watermark)

### Accessibility (A11y)
- ARIA labels and focus states
- Keyboard navigation
- Storybook a11y addon

### Performance
- Lazy-load heavy components (React Flow, charts)
- Bundle analyzer support

### PWA / Offline
- manifest.json + icons
- service worker registration
- offline banner

---

## Testing Coverage
### E2E (Playwright)
- Command palette navigation
- Reports filtering
- PDF export button
- Graph editor interactions
- Risk drawer open/close
- Theme persistence

### Storybook Play Tests
- Theme toggle interaction
- Command palette open (Ctrl+K)
- Reports filters and wizard flow
- Risk drawer open + add action
- Notifications drawer + mark all read
- Incidents filter + generate demo incident

---

## Project Structure (Key Areas)
- src/app — Next.js routes
- src/components — UI and feature components
- src/components/ui — shadcn primitives
- src/lib/mock — mock data
- src/lib/api — mocked API client
- src/stories — Storybook stories
- tests — Playwright E2E

---

## CI / Automation
- GitHub Actions runs Playwright tests
- Storybook can be run for manual QA and interaction tests

---

## How to Run & Verify
See [RUNBOOK.md](RUNBOOK.md) for full instructions.

---

## Notable Files
- Storybook config: .storybook/
- E2E tests: tests/e2e.spec.ts
- CI workflow: .github/workflows/ci.yml
- PWA assets: public/manifest.json, public/sw.js

---

## Current Status
**Production-ready frontend** with testing, documentation, accessibility, performance optimizations, and PWA foundations.

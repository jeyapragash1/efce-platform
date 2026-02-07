# EFCE UI

Enterprise Frontend for Causal & Event Analysis

EFCE UI is a production-ready, frontend-only SaaS dashboard built with Next.js (App Router).
It focuses on enterprise-grade UI architecture, complex workflows, accessibility, performance, and testing, simulating incident analysis, risk management, causal graph editing, counterfactual simulation, and reporting.

This project intentionally emphasizes frontend system design and quality rather than backend implementation. API boundaries are stubbed and ready for future backend integration.

## 🚀 Key Highlights

- Enterprise-style dashboard architecture
- Complex interactive UI (graphs, scenarios, wizards)
- Strong focus on accessibility (a11y) and keyboard navigation
- End-to-end and component interaction testing
- CI automation and performance tooling
- PWA foundations with offline UX feedback

## 🧱 Tech Stack

### Core
- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5 (strict)

### UI & Design
- shadcn/ui + Radix UI
- Tailwind CSS 4
- Lucide Icons

### Data & State (Frontend-only)
- localStorage for persistence
- Mock data modules (src/lib/mock)
- API client boundary (src/lib/api/client.ts)

### Visualization
- React Flow 11 – causal graph editor
- Recharts 3 – charts & comparisons

### Testing & Quality
- Playwright – End-to-End testing
- Storybook 10.2.6
  - a11y addon
  - docs addon
  - interaction (play) tests
- ESLint + strict TypeScript

### Tooling & Build
- Turbopack (Next.js dev)
- Bundle analyzer (ANALYZE=true)
- GitHub Actions CI

### PWA / Offline
- Web app manifest + icons
- Service worker registration
- Offline status banner for UX feedback

## ✨ Features

### Navigation & Shell
- Global Command Palette (Ctrl + K)
- Active route highlighting
- Responsive sidebar with mobile drawer
- Optional breadcrumbs in top bar
- Skip-to-content accessibility support

### Notifications
- Action toasts
- Notification drawer with unread indicators
- Mark-as-read functionality

### Reports
- List + preview layout
- Filters: type, date range, tags, search
- Report templates gallery
- Report generation wizard (frontend simulation)
- Loading, empty, and error states

### Risk Registry
- Tabular risk list with drawer-based details
- Status timeline
- Mitigation controls
- Add-action modal

### Graph Studio
- Node and edge editor
- Add/remove nodes and edges
- Edge confidence slider
- Evidence notes panel
- Local versioning using localStorage

### Counterfactual Lab
- Scenario builder with toggles and sliders
- Scenario A vs B comparison
- Delta chart against baseline
- Save/load scenarios locally

### Incidents
- Filtering and search
- Demo incident generator
- Persistent state via localStorage

### Settings
- Theme toggle
- Report defaults
- Keyboard shortcut toggle
- Export defaults (format and watermark)

### Accessibility (A11y)
- ARIA labels and focus management
- Keyboard navigation across major flows
- Storybook accessibility checks

### Performance
- Lazy-loading for heavy components (React Flow, charts)
- Bundle size inspection with analyzer

### PWA / Offline
- manifest.json with icons
- Service worker registration
- Offline detection banner

## 🧪 Testing Coverage

### End-to-End (Playwright)
- Command palette navigation
- Reports filtering
- Export button behavior
- Graph editor interactions
- Risk drawer open/close
- Theme persistence

### Storybook Interaction Tests
- Theme toggle
- Command palette open (Ctrl + K)
- Reports filters and wizard flow
- Risk drawer and add-action flow
- Notification drawer interactions
- Incident filtering and demo generation

## 🗂️ Project Structure

src/
├── app/                # Next.js App Router routes & layouts
├── components/         # Feature and shared components
│   └── ui/             # shadcn/ui primitives
├── lib/
│   ├── mock/           # Mock data modules
│   └── api/            # Mocked API client boundary
├── stories/            # Storybook stories & play tests
tests/                  # Playwright E2E tests

## 🤖 CI & Automation

- GitHub Actions runs Playwright tests on pull requests
- Storybook used for manual QA and interaction testing

## ▶️ Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Install
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Run Storybook
```bash
npm run storybook
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Analyze Bundle
```bash
ANALYZE=true npm run build
```

Full run and verification steps are documented in RUNBOOK.md.

## 📁 Notable Files

- Storybook config: .storybook/
- E2E tests: tests/e2e.spec.ts
- CI workflow: .github/workflows/ci.yml
- PWA assets: public/manifest.json, public/sw.js

## 🛣️ Roadmap

- Backend integration (REST API)
- Authentication and role-based access
- Server-side persistence
- Real report generation (PDF)
- Graph validation and advanced versioning
- Real-time updates

## Backend Architecture (Planned)

EFCE UI is designed with a clear frontend–backend boundary.
The backend will be implemented using FastAPI with PostgreSQL, focusing on domain-driven APIs and strong data validation.

### Planned Backend Stack

- FastAPI (Python) – REST API framework
- PostgreSQL – relational data storage
- SQLAlchemy / SQLModel – ORM
- Pydantic – request/response validation
- JWT Authentication – access and refresh tokens
- Alembic – database migrations
- Pytest – backend testing

### API Design (Planned Domains)

The backend will expose REST endpoints aligned with existing UI domains:

- /auth – authentication and session management
- /incidents – incident listing, filtering, creation
- /risks – risk registry, timelines, mitigation actions
- /reports – report templates, generation, history
- /graphs – causal graph storage and versioning
- /scenarios – counterfactual scenarios and comparisons

### Data & Persistence

- Server-side persistence will replace frontend localStorage
- localStorage will remain for:
  - UI preferences (theme, shortcuts)
  - Draft states (wizard progress)
- Backend will act as the source of truth

### Integration Strategy

- Frontend will continue to consume a typed API client
- Mock API layer will be replaced incrementally
- Existing UI workflows will remain unchanged during migration

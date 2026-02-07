# EFCE UI Runbook

This guide explains how to run the app, verify everything works, and lists all available page URLs.

## Prerequisites
- Node.js 18+
- npm

## Install
```bash
npm install
```

## Run (Development)
```bash
npm run dev
```
Open:
- http://localhost:3000/dashboard

## Run (Production)
```bash
npm run build
npm run start
```
Open:
- http://localhost:3000/dashboard

## Storybook (Component Library)
```bash
npm run storybook
```
Open:
- http://localhost:6006

## E2E Tests (Playwright)
```bash
npm run test:e2e
```
CI mode:
```bash
npm run test:e2e:ci
```

## Storybook Interaction Tests (Play functions)
Run Storybook, then use the “Interactions” panel in each story to verify play tests.

## Bundle Analysis
```bash
npm run analyze
```
This builds and opens the bundle analyzer when `ANALYZE=true` is set by the script.

## PWA / Offline Check
1. Run the app (`npm run dev` or `npm run start`).
2. Open DevTools → Application → Service Workers.
3. Confirm `sw.js` is registered.
4. Toggle “Offline” and refresh to see cached fallback.

## Smoke Checklist (Manual)
- Command Palette: Press Ctrl+K and navigate to a page.
- Reports: Filters + preview + “Generate report” wizard.
- Risk Registry: Click a row → drawer opens → add action.
- Graph Studio: Add node modal, slider, save version.
- Counterfactual Lab: Compare Scenario A/B, save to localStorage.
- Incidents: Generate demo incident.
- Theme: Toggle dark mode.
- Notifications: Open bell drawer, mark as read.

---

# Page URLs
Base URL: http://localhost:3000

## Core
- Dashboard Overview: /dashboard
- Incidents: /dashboard/incidents
- Incident Detail (example): /dashboard/incidents/INC-001
- Patterns: /dashboard/patterns
- Graph Studio: /dashboard/graph-studio
- Counterfactual Lab: /dashboard/counterfactual-lab
- Reports: /dashboard/reports
- Risk Registry: /dashboard/risk-registry

## Utilities
- Search: /dashboard/search
- Settings: /dashboard/settings
- Help / Docs: /dashboard/help

---

# Troubleshooting
- If Storybook fails to index stories, restart Storybook.
- If Playwright fails on Windows, ensure browsers are installed:
  ```bash
  npx playwright install
  ```
- Clear localStorage if cached data causes confusion.

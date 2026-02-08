# EFCE Platform Project Summary

## Overview
This repository contains a front-end application for the EFCE platform. The active app lives in the efce-ui folder and is built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It includes Storybook for component development, Vitest for unit testing, and Playwright for interaction and e2e coverage.

## Project Purpose And Value
The EFCE platform is designed to help teams understand incidents and risks by modeling causal relationships and evaluating mitigation strategies. It provides interactive tools for building causal graphs, reviewing evidence, and exploring counterfactual outcomes so stakeholders can make better decisions.

## What The Project Does
- Visualizes causal relationships between events and risks.
- Lets users build and edit graphs with nodes, edges, and confidence weights.
- Captures evidence notes to support causal assumptions.
- Provides dashboards and reports to review incidents and trends.
- Supports exports and summaries for sharing findings.

## Why This Project Exists
- Improve clarity on root causes and contributing factors.
- Reduce repeat incidents by documenting evidence and assumptions.
- Enable teams to test “what-if” scenarios before taking action.
- Centralize risk analysis workflows in a single UI.

## Intended Users And Use Cases
- Risk and safety teams modeling incident pathways.
- Analysts reviewing incident trends and repeat rates.
- Operations teams evaluating mitigation options.
- Leadership reviewing reports and evidence-backed decisions.

## What Was Done In This Session
This section captures the work completed during the troubleshooting and stabilization effort.

### Tooling and Environment
- Standardized on Node 20.19+ for local runs.
- Installed Playwright browsers required by Storybook tests.
- Reconciled dev vs build tooling with Webpack for dev and Turbopack for build to avoid asset and build errors.

### Next.js App Updates
- Replaced the default home page with a redirect to /dashboard.
- Moved themeColor metadata to the viewport export to avoid Next.js warnings.

### Runtime Warning Fixes
- Fixed a React hook order issue in the risk drawer.
- Prevented React update depth loops in counterfactual simulation.
- Fixed Recharts size warnings by giving charts stable height.
- Resolved hydration mismatch in theme toggle by rendering after mount.

### Storybook Stability Improvements
- Scoped play tests to the canvas when possible.
- Added data-testid hooks for reliable targeting in tests.
- Addressed common portal query issues by using appropriate query scopes.

### Documentation Updates
- Updated README to reflect Node and tooling requirements.
- Marked backend and service implementation as planned in documentation.

### Graph Editor Improvements
- Fixed potential ID collisions by using unique IDs.
- Made edge label formatting consistent.
- Cleared selected node when loading saved versions.

## Current Project Structure
- efce-ui: main front-end app
- src/app: Next.js App Router pages and layouts
- src/components: reusable UI and feature components
- src/components/graphs: graph editor and causal graph
- src/lib: client utilities, hooks, and mock data
- src/stories: Storybook stories for UI and pages
- tests: Playwright e2e tests

## Key Features In The Front-End
- Dashboard layouts and navigation
- Graph editor with evidence notes and versioning
- Risk registry and risk detail drawer
- Reports and export workflows
- Notifications, command palette, and settings
- Offline banner and service worker integration
- Counterfactual simulation and scenario exploration
- Incident trends and repeat-rate visualizations
- Causal graph viewer and graph editing tools
- Profile settings and onboarding tour flows
- Theme toggle and UI component library (shadcn/ui)

## Known Constraints And Notes
- Dev server uses Webpack to avoid Turbopack asset issues.
- Build uses Turbopack to keep production build stable.
- Some Storybook tests are sensitive to async rendering and portals.

## How To Run
- Install dependencies: npm install
- Run dev server: npm run dev
- Run Storybook: npm run storybook
- Build production: npm run build
- Start production: npm run start

## Suggested Next Steps
- Re-run dev and Storybook to confirm no regressions.
- Add or extend interaction tests for graph editor coverage if needed.
- Expand backend or API integration once the service layer is ready.

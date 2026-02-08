# EFCE Platform Project Summary

## Overview
This repository contains a front-end application for the EFCE platform. The active app lives in the efce-ui folder and is built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It includes Storybook for component development, Vitest for unit testing, and Playwright for interaction and e2e coverage.

The repository now also includes a FastAPI backend in the backend folder, backed by PostgreSQL, Alembic migrations, and JWT authentication with a login-only flow (admin-only registration).

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
This section captures the work completed during the stabilization, backend integration, and data seeding effort.

### Backend Foundation
- Added FastAPI backend with PostgreSQL and JWT auth (login-only, admin-only registration).
- Added Alembic migrations and initial schema.
- Added seed.sql for sample data loading.
- Exposed API routes for incidents, risks, reports, metrics, patterns, graphs, analysis, notifications, onboarding, scenarios, graph studio, and report exports.

### Frontend Integration
- Wired UI to backend endpoints for incidents, risks, reports, metrics, patterns, graphs, analysis, notifications, onboarding, scenarios, graph studio, and report exports.
- Added login screen and auth gate for protected routes.
- Updated command palette behavior to respect authentication.

### Data Persistence
- Notifications, onboarding, scenarios, and graph studio state persisted in PostgreSQL.
- Report exports logged to the backend.
- Incident search backed by API.

### Migrations and Seeding
- Resolved Alembic migration errors and permission issues.
- Adjusted initial migration to prevent duplicate index creation.
- Seeded 10 sample rows per table using seed.sql.

### Runtime Fixes
- Fixed React Flow crash by ensuring nodes have valid positions in causal graph rendering.

## Current Project Structure
- efce-ui: main front-end app
- backend: FastAPI + PostgreSQL backend
- src/app: Next.js App Router pages and layouts
- src/components: reusable UI and feature components
- src/components/graphs: graph editor and causal graph
- src/lib: client utilities, hooks, and mock data
- src/stories: Storybook stories for UI and pages
- tests: Playwright e2e tests

## Key Features In The Front-End
- Dashboard layouts and navigation
- Graph editor with evidence notes and backend versioning
- Risk registry and risk detail drawer
- Reports and export workflows
- Notifications, command palette, and settings (notifications persisted)
- Offline banner and service worker integration
- Counterfactual simulation and scenario exploration (scenarios persisted)
- Incident trends and repeat-rate visualizations
- Causal graph viewer and graph editing tools (server-backed data)
- Profile settings and onboarding tour flows (onboarding persisted)
- Theme toggle and UI component library (shadcn/ui)

## Known Constraints And Notes
- Dev server uses Webpack to avoid Turbopack asset issues.
- Build uses Turbopack to keep production build stable.
- Some Storybook tests are sensitive to async rendering and portals.
- Alembic migrations must be applied before backend startup.

## How To Run
- Install dependencies: npm install
- Run dev server: npm run dev
- Run Storybook: npm run storybook
- Build production: npm run build
- Start production: npm run start

### Backend Setup
- Create venv and install deps: python -m venv .venv; ./.venv/Scripts/activate; pip install -r requirements.txt
- Configure .env
- Run migrations: alembic upgrade head
- (Optional) Seed data: psql -d efce -f seed.sql
- Start API: uvicorn app.main:app --reload

## Suggested Next Steps
- Re-run dev and Storybook to confirm no regressions.
- Add or extend interaction tests for graph editor coverage if needed.
- Expand backend or API integration once the service layer is ready.

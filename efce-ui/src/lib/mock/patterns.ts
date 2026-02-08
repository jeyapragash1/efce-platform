// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type CausePattern = {
  cause: string;
  count: number; // how many incidents
  avgImpact: "HIGH" | "MEDIUM" | "LOW";
};

export type ServiceCauseMatrixRow = {
  service: string;
  causes: Record<string, number>; // cause -> frequency
};

export const topCauses: CausePattern[] = [
  { cause: "Deployment override without rollback plan", count: 9, avgImpact: "HIGH" },
  { cause: "Alert not acknowledged within SLA", count: 7, avgImpact: "HIGH" },
  { cause: "Manual production config changes (drift)", count: 6, avgImpact: "MEDIUM" },
  { cause: "Insufficient CI coverage on critical path", count: 5, avgImpact: "MEDIUM" },
  { cause: "Missing rate-limits / traffic spikes", count: 4, avgImpact: "LOW" },
];

export const matrixCauses = [
  "Deployment override without rollback plan",
  "Alert not acknowledged within SLA",
  "Manual production config changes (drift)",
  "Insufficient CI coverage on critical path",
];

export const serviceCauseMatrix: ServiceCauseMatrixRow[] = [
  {
    service: "payments-api",
    causes: {
      "Deployment override without rollback plan": 4,
      "Alert not acknowledged within SLA": 3,
      "Manual production config changes (drift)": 2,
      "Insufficient CI coverage on critical path": 2,
    },
  },
  {
    service: "orders-api",
    causes: {
      "Deployment override without rollback plan": 2,
      "Alert not acknowledged within SLA": 2,
      "Manual production config changes (drift)": 2,
      "Insufficient CI coverage on critical path": 1,
    },
  },
  {
    service: "auth-service",
    causes: {
      "Deployment override without rollback plan": 1,
      "Alert not acknowledged within SLA": 1,
      "Manual production config changes (drift)": 1,
      "Insufficient CI coverage on critical path": 2,
    },
  },
  {
    service: "inventory-api",
    causes: {
      "Deployment override without rollback plan": 2,
      "Alert not acknowledged within SLA": 1,
      "Manual production config changes (drift)": 1,
      "Insufficient CI coverage on critical path": 0,
    },
  },
];

// Simple 7-day trend for “repeat-cause rate”
export const repeatRateTrend = [
  { date: "2026-01-25", repeatRate: 18 },
  { date: "2026-01-26", repeatRate: 22 },
  { date: "2026-01-27", repeatRate: 20 },
  { date: "2026-01-28", repeatRate: 27 },
  { date: "2026-01-29", repeatRate: 31 },
  { date: "2026-01-30", repeatRate: 28 },
  { date: "2026-01-31", repeatRate: 34 },
];


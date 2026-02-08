// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type DailyMetric = {
  date: string; // YYYY-MM-DD
  incidents: number;
  mttr: number; // minutes
};

export const dailyMetrics: DailyMetric[] = [
  { date: "2026-01-25", incidents: 1, mttr: 45 },
  { date: "2026-01-26", incidents: 0, mttr: 0 },
  { date: "2026-01-27", incidents: 2, mttr: 62 },
  { date: "2026-01-28", incidents: 1, mttr: 38 },
  { date: "2026-01-29", incidents: 3, mttr: 71 },
  { date: "2026-01-30", incidents: 1, mttr: 58 },
  { date: "2026-01-31", incidents: 1, mttr: 49 },
];


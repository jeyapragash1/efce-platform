// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type CausePattern = {
  cause: string;
  count: number;
  avgImpact: "HIGH" | "MEDIUM" | "LOW";
};

export type ServiceCauseMatrixRow = {
  service: string;
  causes: Record<string, number>;
};

export type RepeatRateTrend = {
  date: string;
  repeatRate: number;
};

export type PatternsSummary = {
  topCauses: CausePattern[];
  matrixCauses: string[];
  serviceCauseMatrix: ServiceCauseMatrixRow[];
  repeatRateTrend: RepeatRateTrend[];
};

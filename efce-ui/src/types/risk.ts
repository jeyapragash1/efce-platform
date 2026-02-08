// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type RiskStatus = "OPEN" | "IN PROGRESS" | "RESOLVED";

export type RiskItem = {
  id: string;
  risk: string;
  owner: string;
  level: RiskLevel;
  status: RiskStatus;
};


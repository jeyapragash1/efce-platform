// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type ReportType = "Incident" | "Executive" | "Risk";

export type ReportItem = {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  tags: string[];
};


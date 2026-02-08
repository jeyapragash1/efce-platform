// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Incident } from "@/types/incident";

export const incidents: Incident[] = [
  {
    id: "INC-001",
    title: "Deployment cascade failure",
    service: "payments-api",
    severity: "SEV1",
    status: "RESOLVED",
    startedAt: "2026-01-30T11:05:00+05:30",
    durationMin: 70,
  },
  {
    id: "INC-002",
    title: "Config drift caused memory spike",
    service: "orders-api",
    severity: "SEV2",
    status: "OPEN",
    startedAt: "2026-01-31T10:10:00+05:30",
    durationMin: 25,
  },
];


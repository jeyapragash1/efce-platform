// Copyright (c) 2026 Jeyapragash. All rights reserved.

export function getAttribution(incidentId: string) {
  if (incidentId === "INC-001") {
    return [
      { factor: "Deployment override without rollback plan", contribution: 42, type: "Process" },
      { factor: "Alert not acknowledged (fatigue/overload)", contribution: 23, type: "Operations" },
      { factor: "Insufficient test coverage on critical path", contribution: 19, type: "Engineering" },
      { factor: "Manual config override (config drift)", contribution: 16, type: "Technical" },
    ];
  }

  return [{ factor: "No attribution available", contribution: 0, type: "N/A" }];
}

export function getCounterfactuals(incidentId: string) {
  if (incidentId === "INC-001") {
    return [
      { id: "cf-deploy", label: "Block late-night deployment overrides", delta: -55 },
      { id: "cf-alert", label: "Require alert acknowledgement within 5 minutes", delta: -40 },
      { id: "cf-config", label: "Prevent manual production config changes", delta: -35 },
      { id: "cf-tests", label: "Enforce CI test pass for critical services", delta: -28 },
    ];
  }

  return [{ id: "none", label: "No counterfactuals available", delta: 0 }];
}


import type { RiskItem } from "@/types/risk";

export const risks: RiskItem[] = [
  { id: "RISK-01", risk: "Unreviewed deployments in prod", owner: "SRE", level: "HIGH", status: "OPEN" },
  { id: "RISK-02", risk: "Manual config drift", owner: "Platform", level: "MEDIUM", status: "OPEN" },
  { id: "RISK-03", risk: "Alert fatigue / missing ACK SLA", owner: "Ops", level: "HIGH", status: "IN PROGRESS" },
  { id: "RISK-04", risk: "Missing rate-limits on critical endpoints", owner: "Backend", level: "MEDIUM", status: "OPEN" },
];

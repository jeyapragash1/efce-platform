import type { Node, Edge } from "reactflow";

type EFCEEventMeta = {
  eventType: "CODE_CHANGE" | "DEPLOYMENT" | "CONFIG" | "ALERT" | "FAILURE";
  timestamp: string;
  actor: string; // human/system label
  system: string;
  risk: number; // 0..1
  notes?: string;
};

export function getCausalGraph(
  incidentId: string
): { nodes: Node<{ label: string; meta: EFCEEventMeta }>[]; edges: Edge[] } {
  if (incidentId === "INC-001") {
    const nodes: Node<{ label: string; meta: EFCEEventMeta }>[] = [
      {
        id: "fail",
        position: { x: 560, y: 220 },
        data: {
          label: "Service Outage (Failure)",
          meta: {
            eventType: "FAILURE",
            timestamp: "2026-01-30T11:00:00+05:30",
            actor: "system",
            system: "payments-api",
            risk: 1.0,
            notes: "Requests failing with 5xx. User impact high.",
          },
        },
        style: { borderRadius: 12, padding: 10 },
      },
      {
        id: "alert",
        position: { x: 300, y: 220 },
        data: {
          label: "Alert not acknowledged",
          meta: {
            eventType: "ALERT",
            timestamp: "2026-01-30T10:05:00+05:30",
            actor: "on-call",
            system: "payments-api",
            risk: 0.75,
            notes: "Memory spike alert fired; no ACK within SLA.",
          },
        },
        style: { borderRadius: 12, padding: 10 },
      },
      {
        id: "config",
        position: { x: 80, y: 220 },
        data: {
          label: "Manual config override",
          meta: {
            eventType: "CONFIG",
            timestamp: "2026-01-30T09:35:00+05:30",
            actor: "human",
            system: "payments-api",
            risk: 0.8,
            notes: "Manual change in prod caused drift from desired state.",
          },
        },
        style: { borderRadius: 12, padding: 10 },
      },
      {
        id: "deploy",
        position: { x: 80, y: 80 },
        data: {
          label: "Late-night deployment override",
          meta: {
            eventType: "DEPLOYMENT",
            timestamp: "2026-01-30T09:30:00+05:30",
            actor: "release manager",
            system: "payments-api",
            risk: 0.85,
            notes: "Deployment forced despite partial test failures.",
          },
        },
        style: { borderRadius: 12, padding: 10 },
      },
      {
        id: "commit",
        position: { x: 300, y: 80 },
        data: {
          label: "Large unreviewed commit",
          meta: {
            eventType: "CODE_CHANGE",
            timestamp: "2026-01-30T09:00:00+05:30",
            actor: "developer",
            system: "payments-api",
            risk: 0.7,
            notes: "Large diff; review skipped due to urgency.",
          },
        },
        style: { borderRadius: 12, padding: 10 },
      },
    ];

    const edges: Edge[] = [
      { id: "e1", source: "commit", target: "deploy", label: "0.7", animated: true },
      { id: "e2", source: "deploy", target: "config", label: "0.9", animated: true },
      { id: "e3", source: "config", target: "alert", label: "0.8", animated: true },
      { id: "e4", source: "alert", target: "fail", label: "0.85", animated: true },
    ];

    return { nodes, edges };
  }

  return {
    nodes: [
      {
        id: "x",
        position: { x: 200, y: 150 },
        data: {
          label: "No graph yet for this incident",
          meta: {
            eventType: "ALERT",
            timestamp: "2026-01-31T00:00:00+05:30",
            actor: "system",
            system: "unknown",
            risk: 0,
          },
        },
      },
    ],
    edges: [],
  };
}

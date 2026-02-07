export type Severity = "SEV1" | "SEV2" | "SEV3";
export type IncidentStatus = "OPEN" | "RESOLVED";

export type Incident = {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  startedAt: string;
  durationMin: number;
};

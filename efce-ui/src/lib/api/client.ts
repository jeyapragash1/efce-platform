// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Incident } from "@/types/incident";
import type { RiskItem } from "@/types/risk";
import type { ReportItem } from "@/types/report";
import type { DailyMetric } from "@/types/metrics";
import type { PatternsSummary } from "@/types/patterns";
import type { AttributionItem, CounterfactualItem } from "@/types/analysis";
import type { CausalGraph } from "@/types/graph";
import type { UserProfile } from "@/types/user";
import type { ControlItem } from "@/types/control";
import type { NotificationItem, NotificationCreate } from "@/types/notification";
import type { OnboardingState, OnboardingUpdate } from "@/types/onboarding";
import type { ScenarioCreate, ScenarioItem, ScenarioUpdate } from "@/types/scenario";
import type { GraphStudioState } from "@/types/graph-studio";
import type { ReportExport } from "@/types/report-export";

type AuthToken = { access_token: string; token_type: string };
type ApiIncident = {
  id: string;
  title: string;
  service: string;
  severity: Incident["severity"];
  status: Incident["status"];
  started_at: string;
  duration_min: number;
  startedAt?: string;
  durationMin?: number;
};
type ApiUserProfile = {
  name: string;
  email: string;
  org?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
};
type ApiPatternItem = {
  cause: string;
  count: number;
  avg_impact?: "HIGH" | "MEDIUM" | "LOW";
  avgImpact?: "HIGH" | "MEDIUM" | "LOW";
};
type ApiRepeatRate = {
  date: string;
  repeat_rate?: number;
  repeatRate?: number;
};
type ApiServiceCauseMatrixRow = {
  service: string;
  causes: Record<string, number>;
};
type ApiPatternsSummary = {
  top_causes?: ApiPatternItem[];
  topCauses?: ApiPatternItem[];
  matrix_causes?: string[];
  matrixCauses?: string[];
  service_cause_matrix?: ApiServiceCauseMatrixRow[];
  serviceCauseMatrix?: ApiServiceCauseMatrixRow[];
  repeat_rate_trend?: ApiRepeatRate[];
  repeatRateTrend?: ApiRepeatRate[];
};
type ApiNotification = {
  id: number;
  message: string;
  type?: "info" | "success" | "error";
  read: boolean;
  created_at: string;
};
type ApiOnboardingState = {
  step: number;
  dismissed: boolean;
};
type ApiScenario = {
  id: string;
  name: string;
  updated_at: string;
  state: {
    enabled: Record<string, boolean>;
    strength: Record<string, number>;
  };
};
type ApiReportExport = {
  id: number;
  incident_id: string;
  created_at: string;
};

const getBaseUrl = () =>
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getStoredToken = () => {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("efce-token") || undefined;
};

export const setStoredToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("efce-token", token);
};

export const clearStoredToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("efce-token");
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearStoredToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const mapIncident = (data: ApiIncident): Incident => ({
  id: data.id,
  title: data.title,
  service: data.service,
  severity: data.severity,
  status: data.status,
  startedAt: data.started_at ?? data.startedAt ?? new Date().toISOString(),
  durationMin: data.duration_min ?? data.durationMin ?? 0,
});

const mapProfile = (data: ApiUserProfile): UserProfile => ({
  name: data.name,
  email: data.email,
  org: data.org ?? "",
  avatarUrl: data.avatar_url ?? data.avatarUrl ?? undefined,
});

const mapPatterns = (data: ApiPatternsSummary): PatternsSummary => ({
  topCauses: (data.top_causes ?? data.topCauses ?? []).map((item) => ({
    cause: item.cause,
    count: item.count,
    avgImpact: item.avg_impact ?? item.avgImpact ?? "LOW",
  })),
  matrixCauses: data.matrix_causes ?? data.matrixCauses ?? [],
  serviceCauseMatrix: (data.service_cause_matrix ?? data.serviceCauseMatrix ?? []).map(
    (row) => ({
      service: row.service,
      causes: row.causes,
    })
  ),
  repeatRateTrend: (data.repeat_rate_trend ?? data.repeatRateTrend ?? []).map((row) => ({
    date: row.date,
    repeatRate: row.repeat_rate ?? row.repeatRate ?? 0,
  })),
});

const mapNotification = (data: ApiNotification): NotificationItem => ({
  id: data.id,
  message: data.message,
  type: data.type,
  read: data.read,
  createdAt: data.created_at,
});

const mapScenario = (data: ApiScenario): ScenarioItem => ({
  id: data.id,
  name: data.name,
  updatedAt: data.updated_at,
  state: data.state,
});

const mapReportExport = (data: ApiReportExport): ReportExport => ({
  id: data.id,
  incidentId: data.incident_id,
  createdAt: data.created_at,
});

export const apiClient = {
  async register(payload: { name: string; email: string; org?: string; password: string }) {
    return request<AuthToken>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async login(payload: { email: string; password: string }) {
    return request<AuthToken>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async getProfile(): Promise<UserProfile> {
    const data = await request<ApiUserProfile>("/profile");
    return mapProfile(data);
  },
  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    const data = await request<ApiUserProfile>("/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name,
        org: payload.org,
        avatar_url: payload.avatarUrl,
      }),
    });
    return mapProfile(data);
  },
  async getIncidents(): Promise<Incident[]> {
    const data = await request<ApiIncident[]>("/incidents");
    return data.map(mapIncident);
  },
  async getIncident(id: string): Promise<Incident> {
    const data = await request<ApiIncident>(`/incidents/${id}`);
    return mapIncident(data);
  },
  async createIncident(payload: Incident): Promise<Incident> {
    const data = await request<ApiIncident>("/incidents", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        started_at: payload.startedAt,
        duration_min: payload.durationMin,
      }),
    });
    return mapIncident(data);
  },
  async getRisks(): Promise<RiskItem[]> {
    return request<RiskItem[]>("/risks");
  },
  async getReports(): Promise<ReportItem[]> {
    return request<ReportItem[]>("/reports");
  },
  async getDailyMetrics(): Promise<DailyMetric[]> {
    return request<DailyMetric[]>("/metrics/daily");
  },
  async getPatterns(): Promise<PatternsSummary> {
    const data = await request<ApiPatternsSummary>("/patterns");
    return mapPatterns(data);
  },
  async getCausalGraph(incidentId: string): Promise<CausalGraph> {
    return request<CausalGraph>(`/graphs/causal/${incidentId}`);
  },
  async getAttribution(incidentId: string): Promise<AttributionItem[]> {
    return request<AttributionItem[]>(`/analysis/attribution/${incidentId}`);
  },
  async getCounterfactuals(incidentId: string): Promise<CounterfactualItem[]> {
    return request<CounterfactualItem[]>(`/analysis/counterfactuals/${incidentId}`);
  },
  async getControls(): Promise<ControlItem[]> {
    return request<ControlItem[]>("/controls");
  },
  async getNotifications(): Promise<NotificationItem[]> {
    const data = await request<ApiNotification[]>("/notifications");
    return data.map(mapNotification);
  },
  async createNotification(payload: NotificationCreate): Promise<NotificationItem> {
    const data = await request<ApiNotification>("/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapNotification(data);
  },
  async markNotificationRead(id: number): Promise<NotificationItem> {
    const data = await request<ApiNotification>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
    return mapNotification(data);
  },
  async markAllNotificationsRead(): Promise<void> {
    await request<void>("/notifications/read-all", { method: "POST" });
  },
  async deleteNotification(id: number): Promise<void> {
    await request<void>(`/notifications/${id}`, { method: "DELETE" });
  },
  async getOnboardingState(): Promise<OnboardingState> {
    return request<ApiOnboardingState>("/onboarding");
  },
  async updateOnboardingState(payload: OnboardingUpdate): Promise<OnboardingState> {
    return request<ApiOnboardingState>("/onboarding", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async getScenarios(): Promise<ScenarioItem[]> {
    const data = await request<ApiScenario[]>("/scenarios");
    return data.map(mapScenario);
  },
  async createScenario(payload: ScenarioCreate): Promise<ScenarioItem> {
    const data = await request<ApiScenario>("/scenarios", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapScenario(data);
  },
  async updateScenario(id: string, payload: ScenarioUpdate): Promise<ScenarioItem> {
    const data = await request<ApiScenario>(`/scenarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapScenario(data);
  },
  async deleteScenario(id: string): Promise<void> {
    await request<void>(`/scenarios/${id}`, { method: "DELETE" });
  },
  async getGraphStudio(): Promise<GraphStudioState> {
    return request<GraphStudioState>("/graphs/studio");
  },
  async updateGraphStudio(payload: GraphStudioState): Promise<GraphStudioState> {
    return request<GraphStudioState>("/graphs/studio", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async exportIncidentReport(incidentId: string): Promise<ReportExport> {
    const data = await request<ApiReportExport>(`/reports/incident/${incidentId}/export`, {
      method: "POST",
    });
    return mapReportExport(data);
  },
  async searchIncidents(query: string): Promise<Incident[]> {
    const data = await request<ApiIncident[]>(`/incidents/search?q=${encodeURIComponent(query)}`);
    return data.map(mapIncident);
  },
};

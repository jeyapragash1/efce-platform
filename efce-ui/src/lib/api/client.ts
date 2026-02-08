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
};

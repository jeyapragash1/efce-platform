// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Incident } from "@/types/incident";
import type { RiskItem } from "@/types/risk";
import type { ReportItem } from "@/types/report";
import type { DailyMetric } from "@/types/metrics";
import type { PatternsSummary } from "@/types/patterns";
import type { AttributionItem, CounterfactualItem } from "@/types/analysis";
import type { CausalGraph } from "@/types/graph";
import type { UserProfile } from "@/types/user";

type AuthToken = { access_token: string; token_type: string };

const getBaseUrl = () =>
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const getToken = () => {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("efce-token") || undefined;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

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
    return request<UserProfile>("/profile");
  },
  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    return request<UserProfile>("/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name,
        org: payload.org,
        avatar_url: payload.avatarUrl,
      }),
    });
  },
  async getIncidents(): Promise<Incident[]> {
    return request<Incident[]>("/incidents");
  },
  async getIncident(id: string): Promise<Incident> {
    return request<Incident>(`/incidents/${id}`);
  },
  async createIncident(payload: Incident): Promise<Incident> {
    return request<Incident>("/incidents", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        started_at: payload.startedAt,
        duration_min: payload.durationMin,
      }),
    });
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
    return request<PatternsSummary>("/patterns");
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
};

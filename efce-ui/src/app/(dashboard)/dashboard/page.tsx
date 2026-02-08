// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import dynamic from "next/dynamic";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { apiClient } from "@/lib/api/client";
import type { Incident } from "@/types/incident";
import type { DailyMetric } from "@/types/metrics";
const IncidentTrends = dynamic(
  () => import("@/components/charts/incident-trends").then((m) => m.IncidentTrends),
  { ssr: false, loading: () => <div className="h-75 w-full rounded bg-muted animate-pulse" /> }
);
const MttrTrends = dynamic(
  () => import("@/components/charts/incident-trends").then((m) => m.MttrTrends),
  { ssr: false, loading: () => <div className="h-75 w-full rounded bg-muted animate-pulse" /> }
);

export default function DashboardPage() {
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [dailyMetrics, setDailyMetrics] = React.useState<DailyMetric[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    Promise.all([apiClient.getIncidents(), apiClient.getDailyMetrics()])
      .then(([incidentData, metricData]) => {
        if (!active) return;
        setIncidents(incidentData);
        setDailyMetrics(metricData);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const open = incidents.filter((i) => i.status === "OPEN").length;
  const sev1 = incidents.filter((i) => i.severity === "SEV1").length;

  const resolved = incidents.filter((i) => i.status === "RESOLVED");
  const mttr =
    Math.round(
      resolved.reduce((a, b) => a + b.durationMin, 0) / Math.max(1, resolved.length)
    ) || 0;

  return (
    <>
      <Topbar title="Overview" />

      <div className="p-6 space-y-4">
        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Open incidents</div>
              <div className="text-2xl font-semibold">{loading ? "—" : open}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">SEV1 (mock)</div>
              <div className="text-2xl font-semibold">{loading ? "—" : sev1}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">MTTR (minutes)</div>
              <div className="text-2xl font-semibold">{loading ? "—" : mttr}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold mb-2">Incidents Trend (7d)</div>
              {loading ? (
                <div className="h-75 w-full rounded bg-muted animate-pulse" />
              ) : dailyMetrics.length === 0 ? (
                <div className="text-sm text-muted-foreground">No metrics available.</div>
              ) : (
                <IncidentTrends data={dailyMetrics} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="font-semibold mb-2">MTTR Trend (7d)</div>
              {loading ? (
                <div className="h-75 w-full rounded bg-muted animate-pulse" />
              ) : dailyMetrics.length === 0 ? (
                <div className="text-sm text-muted-foreground">No metrics available.</div>
              ) : (
                <MttrTrends data={dailyMetrics} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

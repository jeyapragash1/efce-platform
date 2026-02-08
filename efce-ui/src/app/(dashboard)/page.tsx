// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api/client";
import type { Incident } from "@/types/incident";

export default function Page() {
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    apiClient
      .getIncidents()
      .then((data) => {
        if (!active) return;
        setIncidents(data);
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
      <div className="p-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Open incidents</div>
            <div className="text-2xl font-semibold">{loading ? "—" : open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">SEV1 (last 30d)</div>
            <div className="text-2xl font-semibold">{loading ? "—" : sev1}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">MTTR (minutes)</div>
            <div className="text-2xl font-semibold">{loading ? "—" : `${mttr}m`}</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

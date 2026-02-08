// Copyright (c) 2026 Jeyapragash. All rights reserved.

import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api/client";

export default async function Page() {
  const incidents = await apiClient.getIncidents();
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
            <div className="text-2xl font-semibold">{open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">SEV1 (last 30d)</div>
            <div className="text-2xl font-semibold">{sev1}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">MTTR (minutes)</div>
            <div className="text-2xl font-semibold">{mttr}m</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { apiClient } from "@/lib/api/client";
import { CounterfactualSim } from "@/components/counterfactual-sim";
import { ExportIncidentPdfButton } from "@/components/export-incident-pdf";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Incident } from "@/types/incident";
import type { CausalGraph } from "@/types/graph";
import type { AttributionItem, CounterfactualItem } from "@/types/analysis";
import GraphWorkspace from "./graph-workspace";

export default function IncidentDetails() {
  const params = useParams();
  const incidentId = typeof params?.id === "string" ? params.id : "";
  const [incident, setIncident] = React.useState<Incident | null>(null);
  const [graph, setGraph] = React.useState<CausalGraph | null>(null);
  const [attribution, setAttribution] = React.useState<AttributionItem[]>([]);
  const [counterfactuals, setCounterfactuals] = React.useState<CounterfactualItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [missing, setMissing] = React.useState(false);

  React.useEffect(() => {
    if (!incidentId) return;
    let active = true;
    setLoading(true);
    setMissing(false);
    apiClient
      .getIncident(incidentId)
      .then((data) => {
        if (!active) return;
        setIncident(data);
        return Promise.all([
          apiClient.getCausalGraph(data.id),
          apiClient.getAttribution(data.id),
          apiClient.getCounterfactuals(data.id),
        ]);
      })
      .then((result) => {
        if (!active || !result) return;
        const [graphData, attributionData, counterfactualData] = result;
        setGraph(graphData);
        setAttribution(attributionData);
        setCounterfactuals(counterfactualData);
      })
      .catch(() => {
        if (!active) return;
        setMissing(true);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [incidentId]);

  const baseFailureProbability = 92;

  const timeline = [
    "09:00 — Large unreviewed commit",
    "09:30 — Deployment override approved",
    "10:05 — Alert triggered but ignored",
    "11:00 — System crash",
    "11:30 — Emergency rollback",
    "12:15 — Service restored",
  ];

  if (loading) {
    return (
      <>
        <Topbar title="Incident" />
        <div className="p-6 text-sm text-muted-foreground">Loading incident...</div>
      </>
    );
  }

  if (missing || !incident || !graph) {
    return (
      <>
        <Topbar title="Incident" />
        <div className="p-6 text-sm text-muted-foreground">Incident not found.</div>
      </>
    );
  }

  return (
    <>
      <Topbar title={`Incident ${incident.id}`} />

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">{incident.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Service: {incident.service}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{incident.severity}</Badge>
              <Badge variant="outline">{incident.status}</Badge>

              <div className="ml-2">
                <ExportIncidentPdfButton
                  incident={incident}
                  timeline={timeline}
                  attribution={attribution}
                  counterfactuals={counterfactuals}
                  baseProbability={baseFailureProbability}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-1 text-sm">
            <div>Started: {incident.startedAt}</div>
            <div>Duration: {incident.durationMin} minutes</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border rounded-lg p-4">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="graph">Causal Graph</TabsTrigger>
              <TabsTrigger value="attribution">Attribution</TabsTrigger>
              <TabsTrigger value="counterfactual">Counterfactual</TabsTrigger>
            </TabsList>

            {/* Timeline */}
            <TabsContent value="timeline" className="mt-4">
              <h3 className="font-semibold mb-2">Incident Timeline</h3>
              <ul className="text-sm space-y-1">
                {timeline.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </TabsContent>

            {/* Graph */}
            <TabsContent value="graph" className="mt-4">
              <h3 className="font-semibold mb-3">Causal Graph (interactive)</h3>
              <GraphWorkspace nodes={graph.nodes} edges={graph.edges} />
            </TabsContent>

            {/* Attribution */}
            <TabsContent value="attribution" className="mt-4">
              <h3 className="font-semibold mb-3">Failure Attribution</h3>

              <div className="space-y-3">
                {attribution.map((a) => (
                  <div key={a.factor} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{a.factor}</div>
                      <Badge variant="secondary">{a.type}</Badge>
                    </div>

                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground">
                        Contribution: {a.contribution}%
                      </div>
                      <div className="h-2 rounded bg-muted mt-1 overflow-hidden">
                        <div
                          className="h-2 bg-foreground"
                          style={{ width: `${a.contribution}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Counterfactual */}
            <TabsContent value="counterfactual" className="mt-4">
              <h3 className="font-semibold mb-3">
                Counterfactual Simulator (interactive)
              </h3>

              <CounterfactualSim
                baseProbability={baseFailureProbability}
                items={counterfactuals}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

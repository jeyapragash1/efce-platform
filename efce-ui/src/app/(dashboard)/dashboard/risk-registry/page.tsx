// Copyright (c) 2026 Jeyapragash. All rights reserved.


"use client";
import * as React from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiskDetailsDrawer } from "@/components/risk-details-drawer";
import type { RiskItem } from "@/types/risk";
import { apiClient } from "@/lib/api/client";

const controls = [
  { name: "Deploy freeze window policy", category: "Process" },
  { name: "Mandatory rollback plan", category: "Engineering" },
  { name: "No-manual-config in prod (policy)", category: "Platform" },
  { name: "Alert ACK SLA + escalation", category: "Ops" },
];


export default function RiskRegistryPage() {
  const [selected, setSelected] = React.useState<RiskItem | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [riskList, setRiskList] = React.useState<RiskItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient
      .getRisks()
      .then((data) => {
        if (!active) return;
        setRiskList(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load risks");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Topbar title="Risk Registry" />
      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Systemic Risk Management</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Track org-level risks, owners, and mitigation controls (UI-only).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Planned</Badge>
                <Button variant="outline">New Risk</Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium">Ownership</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Assign a team + due dates (later).
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium">Mitigation Controls</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Library of prevention strategies.
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium">Link to Incidents</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Trace risks back to repeated causes.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Risk Table */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Top Risks (mock)</div>
              <Button variant="outline">Export</Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        Loading risks...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : riskList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        No risks available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    riskList.map((r) => (
                    <TableRow
                      key={r.id}
                      data-testid={`risk-row-${r.id}`}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => {
                        setSelected(r);
                        setDrawerOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.risk}</TableCell>
                      <TableCell>{r.owner}</TableCell>
                      <TableCell>
                        <Badge variant={r.level === "HIGH" ? "destructive" : "secondary"}>{r.level}</Badge>
                      </TableCell>
                      <TableCell>{r.status}</TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Controls Library */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Controls Library (mock)</div>
              <Button variant="outline">Add Control</Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {controls.map((c) => (
                <div key={c.name} className="border rounded-lg p-4">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Category: {c.category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <RiskDetailsDrawer risk={selected} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </>
  );
}


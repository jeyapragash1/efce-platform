// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/notifications";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Severity, IncidentStatus, Incident } from "@/types/incident";
import { apiClient } from "@/lib/api/client";

type SeverityFilter = "ALL" | Severity;
type StatusFilter = "ALL" | IncidentStatus;

function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function IncidentsPage() {
  const [query, setQuery] = React.useState("");
  const [severity, setSeverity] = React.useState<SeverityFilter>("ALL");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const { notify } = useNotifications();

  React.useEffect(() => {
    apiClient.getIncidents().then((data) => setIncidents(data));
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return incidents.filter((i) => {
      const matchesQuery =
        q.length === 0 ||
        i.id.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.service.toLowerCase().includes(q);

      const matchesSeverity = severity === "ALL" || i.severity === severity;
      const matchesStatus = status === "ALL" || i.status === status;

      return matchesQuery && matchesSeverity && matchesStatus;
    });
  }, [query, severity, status, incidents]);

  const clearFilters = () => {
    setQuery("");
    setSeverity("ALL");
    setStatus("ALL");
  };

  const generateIncident = async () => {
    const nextId = `INC-${String(incidents.length + 1).padStart(3, "0")}`;
    const rand = seededRandom(nextId);
    const services = ["Orders", "Auth", "Search", "Payments", "Catalog", "Edge API"];
    const titles = [
      "Latency spike during peak traffic",
      "Config drift caused memory leak",
      "Rate limit misconfiguration",
      "Deployment rollback loop",
      "Cache invalidation storm",
      "Queue backpressure escalation",
    ];
    const severities: Severity[] = ["SEV1", "SEV2", "SEV3"];
    const statuses: IncidentStatus[] = ["OPEN", "RESOLVED"];

    const newIncident = {
      id: nextId,
      title: titles[Math.floor(rand() * titles.length)],
      service: services[Math.floor(rand() * services.length)],
      severity: severities[Math.floor(rand() * severities.length)],
      status: statuses[Math.floor(rand() * statuses.length)],
      startedAt: new Date().toISOString(),
      durationMin: Math.floor(rand() * 180) + 10,
    };

    try {
      const created = await apiClient.createIncident(newIncident);
      setIncidents((prev) => [created, ...prev]);
      notify({ message: `Generated ${nextId}`, type: "success" });
    } catch {
      notify({ message: "Failed to create incident", type: "error" });
    }
  };

  return (
    <>
      <Topbar title="Incidents" />

      <div className="p-6 space-y-4">
        {/* Controls */}
        <div className="border rounded-lg p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Search</div>
              <Input
                placeholder="Search by ID / title / service..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="incidents-search"
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Severity</div>
              <Select
                value={severity}
                onValueChange={(v) => setSeverity(v as Severity)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="SEV1">SEV1</SelectItem>
                  <SelectItem value="SEV2">SEV2</SelectItem>
                  <SelectItem value="SEV3">SEV3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as StatusFilter)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filtered.length}</span> of{" "}
              <span className="font-medium">{incidents.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={generateIncident} data-testid="incidents-generate">
                Generate demo incident
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/incidents/${i.id}`}
                      className="font-medium underline"
                    >
                      {i.id}
                    </Link>
                  </TableCell>

                  <TableCell>{i.title}</TableCell>
                  <TableCell>{i.service}</TableCell>

                  <TableCell>
                    <Badge variant="secondary">{i.severity}</Badge>
                  </TableCell>

                  <TableCell>{i.status}</TableCell>
                  <TableCell>{i.durationMin} min</TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <div className="text-sm text-muted-foreground">
                      No incidents match your filters.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

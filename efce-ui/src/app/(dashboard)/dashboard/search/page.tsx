// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api/client";
import type { Incident } from "@/types/incident";

const tips = [
  "Try: INC-001",
  "Try: payments",
  "Try: deploy",
  "Try: SEV1 (coming later)",
];

export default function SearchPage() {
  const [q, setQ] = React.useState("");
  const [incidents, setIncidents] = React.useState<Incident[]>([]);

  React.useEffect(() => {
    apiClient.getIncidents().then((data) => setIncidents(data));
  }, []);

  const results = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return incidents.filter(
      (i) =>
        i.id.toLowerCase().includes(s) ||
        i.title.toLowerCase().includes(s) ||
        i.service.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <>
      <Topbar title="Search" />

      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Global Search</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Search incidents by ID, title, or service.
                </p>
              </div>
              <Button variant="outline" onClick={() => setQ("")}>
                Clear
              </Button>
            </div>

            <div className="mt-4">
              <Input
                placeholder="Search… (ex: INC-001, payments, deployment)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {tips.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="text-sm font-medium mb-3">Results</div>

            {q.trim() === "" ? (
              <div className="text-sm text-muted-foreground">
                Start typing to search.
              </div>
            ) : results.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No matches found.
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {r.id} — {r.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Service: {r.service} · Severity: {r.severity} · Status: {r.status}
                      </div>
                    </div>
                    <Link className="text-sm underline" href={`/dashboard/incidents/${r.id}`}>
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="font-semibold">Next build</div>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Global “Ctrl+K” command palette</li>
              <li>• Search across Reports + Risks + Patterns</li>
              <li>• Filter chips (SEV, status, service)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

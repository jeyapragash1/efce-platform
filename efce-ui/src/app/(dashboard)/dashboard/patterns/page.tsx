"use client";

import dynamic from "next/dynamic";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  topCauses,
  matrixCauses,
  serviceCauseMatrix,
  repeatRateTrend,
} from "@/lib/mock/patterns";
const RepeatRateChart = dynamic(
  () => import("@/components/charts/repeat-rate-chart").then((m) => m.RepeatRateChart),
  { ssr: false, loading: () => <div className="h-75 w-full rounded bg-muted animate-pulse" /> }
);

function impactBadge(impact: "HIGH" | "MEDIUM" | "LOW") {
  if (impact === "HIGH") return <Badge variant="destructive">HIGH</Badge>;
  if (impact === "MEDIUM") return <Badge variant="secondary">MEDIUM</Badge>;
  return <Badge variant="outline">LOW</Badge>;
}

function cellClass(v: number) {
  if (v >= 4) return "bg-muted";
  if (v === 3) return "bg-muted/70";
  if (v === 2) return "bg-muted/50";
  if (v === 1) return "bg-muted/30";
  return "bg-transparent";
}

function barWidthClass(v: number) {
  const rounded = Math.round(Math.min(100, v * 10) / 5) * 5;
  return `w-[${rounded}%]`;
}

export default function PatternsPage() {
  const totalRepeats = topCauses.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <Topbar title="Patterns" />

      <div className="p-6 space-y-4">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                Total repeat patterns (mock)
              </div>
              <div className="text-2xl font-semibold">{totalRepeats}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Top repeating cause</div>
              <div className="text-base font-semibold mt-1">
                {topCauses[0]?.cause ?? "-"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Focus area</div>
              <div className="text-base font-semibold mt-1">
                Deployments + Alerting hygiene
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend */}
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold mb-2">Repeat-Cause Rate (7d)</div>
            {repeatRateTrend.length === 0 ? (
              <div className="text-sm text-muted-foreground">No trend data available.</div>
            ) : (
              <RepeatRateChart data={repeatRateTrend} />
            )}
            <p className="text-xs text-muted-foreground mt-2">
              This metric represents the percentage of incidents caused by previously seen patterns (mock).
            </p>
          </CardContent>
        </Card>

        {/* Top Causes */}
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold mb-3">Top Recurring Causes</div>

            {topCauses.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recurring causes available.</div>
            ) : (
              <div className="space-y-3">
                {topCauses.map((c) => (
                  <div key={c.cause} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium">{c.cause}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Frequency: {c.count} incidents
                        </div>
                      </div>
                      {impactBadge(c.avgImpact)}
                    </div>

                    <div className="mt-3 h-2 rounded bg-muted overflow-hidden">
                      <div className={`h-2 bg-foreground ${barWidthClass(c.count)}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matrix */}
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold mb-3">Service × Cause Matrix</div>

            {serviceCauseMatrix.length === 0 ? (
              <div className="text-sm text-muted-foreground">No matrix data available.</div>
            ) : (
              <div className="overflow-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 whitespace-nowrap">Service</th>
                      {matrixCauses.map((cause) => (
                        <th key={cause} className="text-left p-3 min-w-65">
                          {cause}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {serviceCauseMatrix.map((row) => (
                      <tr key={row.service} className="border-t">
                        <td className="p-3 font-medium whitespace-nowrap">
                          {row.service}
                        </td>

                        {matrixCauses.map((cause) => {
                          const v = row.causes[cause] ?? 0;
                          return (
                            <td key={cause} className={`p-3 ${cellClass(v)}`}>
                              <div className="flex items-center justify-between gap-2">
                                <span>{v}</span>
                                <span className="text-xs text-muted-foreground">
                                  {v === 0 ? "—" : "hits"}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-2">
              This acts like a heatmap using subtle intensity. Later we can make it a true heatmap component.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

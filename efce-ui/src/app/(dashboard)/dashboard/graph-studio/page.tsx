
"use client";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
const GraphEditor = dynamic(
  () => import("@/components/graphs/graph-editor").then((m) => m.GraphEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full rounded-lg border bg-muted animate-pulse" />
    ),
  }
);

const templates = [
  { name: "Deployment → Config Drift → Outage", level: "Standard" },
  { name: "Traffic Spike → Rate Limit → Partial Failure", level: "Standard" },
  { name: "DB Lock → Queue Backpressure → Timeout Cascade", level: "Advanced" },
];

const recentGraphs = [
  { id: "G-101", title: "INC-001 causal chain", updated: "2026-01-31" },
  { id: "G-102", title: "Orders API deploy rollback", updated: "2026-01-30" },
  { id: "G-103", title: "Auth service alert fatigue", updated: "2026-01-28" },
];

export default function GraphStudioPage() {
  return (
    <>
      <Topbar title="Graph Studio" />

      <div className="p-6 space-y-4">

        {/* Graph Editor */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-4">
              <div className="text-lg font-semibold">Causal Graph Workspace (Editor)</div>
              <p className="text-sm text-muted-foreground mt-1">
                Add, remove, and connect nodes. Drag to move. Edit edge weights.
              </p>
            </div>
            <GraphEditor />
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Graph Templates</div>
              <Button variant="outline">Browse Templates</Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {templates.map((t) => (
                <div key={t.name} className="border rounded-lg p-4">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Level: {t.level}
                  </div>
                  <div className="mt-3">
                    <Button variant="default">Use Template</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Recent Graphs</div>
              <Button variant="outline">Open Library</Button>
            </div>

            <div className="mt-4 space-y-2">
              {recentGraphs.map((g) => (
                <div
                  key={g.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {g.id} — {g.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated: {g.updated}
                    </div>
                  </div>
                  <Button variant="outline">Open</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card>
          <CardContent className="p-5">
            <div className="font-semibold">Next build</div>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Node/edge editor (add/remove + drag)</li>
              <li>• Edge weight slider + confidence labels</li>
              <li>• Evidence panel + notes</li>
              <li>• Local “save versions” (localStorage)</li>
              <li>• Export graph image + embed into report</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

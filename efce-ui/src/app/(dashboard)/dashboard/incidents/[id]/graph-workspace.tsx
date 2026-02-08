// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import type { Node, Edge } from "reactflow";
import { CausalGraph } from "@/components/graphs/causal-graph";
import { Badge } from "@/components/ui/badge";

type MetaNode = Node<{ label: string; meta: any }>;

export default function GraphWorkspace({
  nodes,
  edges,
}: {
  nodes: MetaNode[];
  edges: Edge[];
}) {
  const [selected, setSelected] = React.useState<MetaNode | null>(null);

  const meta = selected?.data?.meta;
  const selectedLabel = selected?.data?.label ?? "Untitled node";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CausalGraph
          nodes={nodes}
          edges={edges}
          onNodeSelect={(n) => setSelected(n as MetaNode)}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Tip: click a node to inspect the event metadata.
        </p>
      </div>

      <div className="border rounded-lg p-4 h-[520px] overflow-auto">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Event Details</h4>
          {meta?.eventType ? <Badge variant="secondary">{meta.eventType}</Badge> : null}
        </div>

        {!selected ? (
          <p className="text-sm text-muted-foreground mt-3">
            Select a node in the graph to view details.
          </p>
        ) : (
          <div className="mt-4 space-y-2 text-sm">
            <div className="font-medium">{selectedLabel}</div>

            <div className="text-muted-foreground">Timestamp</div>
            <div>{meta?.timestamp ?? "-"}</div>

            <div className="text-muted-foreground mt-2">Actor</div>
            <div>{meta?.actor ?? "-"}</div>

            <div className="text-muted-foreground mt-2">System</div>
            <div>{meta?.system ?? "-"}</div>

            <div className="text-muted-foreground mt-2">Risk</div>
            <div>{typeof meta?.risk === "number" ? meta.risk.toFixed(2) : "-"}</div>

            <div className="text-muted-foreground mt-2">Notes</div>
            <div>{meta?.notes ?? "-"}</div>
          </div>
        )}
      </div>
    </div>
  );
}

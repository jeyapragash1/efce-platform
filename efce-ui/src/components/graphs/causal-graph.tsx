// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

export function CausalGraph<T>({
  nodes,
  edges,
  onNodeSelect,
}: {
  nodes: Node<T>[];
  edges: Edge[];
  onNodeSelect?: (node: Node<T>) => void;
}) {
  const safeNodes = React.useMemo(
    () =>
      nodes.map((node, index) => {
        const hasPosition =
          typeof node.position?.x === "number" && typeof node.position?.y === "number";

        if (hasPosition) {
          return node;
        }

        const col = index % 5;
        const row = Math.floor(index / 5);

        return {
          ...node,
          position: {
            x: 120 + col * 180,
            y: 80 + row * 140,
          },
        };
      }),
    [nodes]
  );

  return (
    <div
      id="efce-graph-capture"
      className="h-[520px] w-full rounded-lg border bg-white"
    >
      <ReactFlow
        nodes={safeNodes}
        edges={edges}
        fitView
        onNodeClick={(_, node) => onNodeSelect?.(node)}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}


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
  return (
    <div
      id="efce-graph-capture"
      className="h-[520px] w-full rounded-lg border bg-white"
    >
      <ReactFlow
        nodes={nodes}
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

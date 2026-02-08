// Copyright (c) 2026 Jeyapragash. All rights reserved.

// src/components/graphs/graph-editor.tsx
"use client";

import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api/client";
import type { GraphStudioState } from "@/types/graph-studio";

export function GraphEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { label: "Start" },
      style: { borderRadius: 12, padding: 10 },
    },
    {
      id: "2",
      position: { x: 300, y: 100 },
      data: { label: "End" },
      style: { borderRadius: 12, padding: 10 },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1-2", source: "1", target: "2", label: "70%", animated: true },
  ]);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [newNodeLabel, setNewNodeLabel] = React.useState("");
  const [edgeWeight, setEdgeWeight] = React.useState(0.7);
  const [nodeModalOpen, setNodeModalOpen] = React.useState(false);
  const [evidenceText, setEvidenceText] = React.useState("");
  const [evidenceNotes, setEvidenceNotes] = React.useState<{ id: string; text: string; time: string }[]>([]);
  const [versions, setVersions] = React.useState<
    { id: string; name: string; createdAt: string; nodes: Node[]; edges: Edge[] }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  const createId = React.useCallback(() => {
    if (typeof globalThis.crypto?.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  React.useEffect(() => {
    let active = true;
    apiClient
      .getGraphStudio()
      .then((data) => {
        if (!active) return;
        setNodes(data.nodes as Node[]);
        setEdges(data.edges as Edge[]);
        setEvidenceNotes((data.evidence as { id: string; text: string; time: string }[]) ?? []);
        setVersions((data.versions as { id: string; name: string; createdAt: string; nodes: Node[]; edges: Edge[] }[]) ?? []);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setNodes, setEdges]);

  const persistStudio = React.useCallback(
    (next: Partial<GraphStudioState>) => {
      const payload: GraphStudioState = {
        nodes: next.nodes ?? (nodes as unknown as GraphStudioState["nodes"]),
        edges: next.edges ?? (edges as unknown as GraphStudioState["edges"]),
        evidence: next.evidence ?? (evidenceNotes as unknown as GraphStudioState["evidence"]),
        versions: next.versions ?? (versions as unknown as GraphStudioState["versions"]),
      };
      apiClient.updateGraphStudio(payload).catch(() => undefined);
    },
    [nodes, edges, evidenceNotes, versions]
  );

  // Add node
  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    const id = createId();
    setNodes((nds) => {
      const updated = [
        ...nds,
        {
          id,
          position: { x: 200, y: 200 },
          data: { label: newNodeLabel },
          style: { borderRadius: 12, padding: 10 },
        },
      ];
      persistStudio({ nodes: updated as unknown as GraphStudioState["nodes"] });
      return updated;
    });
    setNewNodeLabel("");
    setNodeModalOpen(false);
  };

  // Add edge
  const onConnect = React.useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        {
          const updated = addEdge(
            { ...params, label: `${Math.round(edgeWeight * 100)}%`, animated: true },
            eds
          );
          persistStudio({ edges: updated as unknown as GraphStudioState["edges"] });
          return updated;
        }
      ),
    [edgeWeight, setEdges]
  );

  // Remove node
  const removeNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => {
      const updated = nds.filter((n) => n.id !== selectedNode.id);
      persistStudio({ nodes: updated as unknown as GraphStudioState["nodes"] });
      return updated;
    });
    setEdges((eds) => {
      const updated = eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id);
      persistStudio({ edges: updated as unknown as GraphStudioState["edges"] });
      return updated;
    });
    setSelectedNode(null);
  };

  // Change edge weight
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    if (!newConnection.source || !newConnection.target) return;
    const connection = {
      ...newConnection,
      source: newConnection.source,
      target: newConnection.target,
    } as Connection & { source: string; target: string };
    setEdges((eds) => {
      const updated = eds.map((e) =>
        e.id === oldEdge.id ? { ...e, ...connection, label: oldEdge.label } : e
      );
      persistStudio({ edges: updated as unknown as GraphStudioState["edges"] });
      return updated;
    });
  };

  const saveVersion = () => {
    const id = createId();
    setVersions((prev) => {
      const updated = [
        {
          id,
          name: `Version ${prev.length + 1}`,
          createdAt: new Date().toLocaleString(),
          nodes,
          edges,
        },
        ...prev,
      ];
      persistStudio({ versions: updated as unknown as GraphStudioState["versions"] });
      return updated;
    });
  };

  const loadVersion = (id: string) => {
    const version = versions.find((v) => v.id === id);
    if (!version) return;
    setNodes(version.nodes);
    setEdges(version.edges);
    persistStudio({
      nodes: version.nodes as unknown as GraphStudioState["nodes"],
      edges: version.edges as unknown as GraphStudioState["edges"],
    });
    setSelectedNode(null);
  };

  const addEvidence = () => {
    if (!evidenceText.trim()) return;
    setEvidenceNotes((prev) => {
      const updated = [
        { id: Math.random().toString(36).slice(2), text: evidenceText.trim(), time: new Date().toLocaleTimeString() },
        ...prev,
      ];
      persistStudio({ evidence: updated as unknown as GraphStudioState["evidence"] });
      return updated;
    });
    setEvidenceText("");
  };

  return (
    <div className="w-full rounded-lg border bg-white" data-testid="graph-editor">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-muted items-center">
        <Button size="sm" onClick={() => setNodeModalOpen(true)} data-testid="graph-add-node">
          Add Node
        </Button>
        <Button size="sm" variant="outline" onClick={removeNode} disabled={!selectedNode} data-testid="graph-remove-node">
          Remove Node
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Confidence</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={edgeWeight}
            onChange={(e) => setEdgeWeight(Number(e.target.value))}
            aria-label="Edge confidence"
            data-testid="graph-edge-weight"
          />
          <span className="w-12 text-right">{Math.round(edgeWeight * 100)}%</span>
        </div>
        <Button size="sm" variant="outline" onClick={saveVersion}>
          Save version
        </Button>
      </div>

      <div className="grid gap-3 p-3 md:grid-cols-[1fr_280px]">
        <div className="min-h-130 rounded-lg border bg-background">
          {loading ? (
            <div className="h-130 w-full rounded bg-muted animate-pulse" />
          ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onEdgeUpdate={onEdgeUpdate}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
          )}
        </div>

        <div className="rounded-lg border bg-background p-3 space-y-4">
          <div>
            <div className="text-sm font-medium">Evidence notes</div>
            <textarea
              className="mt-2 w-full border rounded px-2 py-1 text-sm min-h-20"
              placeholder="Add evidence or rationale for edges..."
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
            />
            <Button size="sm" className="mt-2" onClick={addEvidence}>Add note</Button>
            <div className="mt-3 space-y-2">
              {evidenceNotes.length === 0 ? (
                <div className="text-xs text-muted-foreground">No evidence notes yet.</div>
              ) : (
                evidenceNotes.map((note) => (
                  <div key={note.id} className="text-xs border rounded p-2">
                    <div className="text-muted-foreground">{note.time}</div>
                    <div>{note.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Saved versions</div>
            <div className="mt-2 space-y-2">
              {versions.length === 0 ? (
                <div className="text-xs text-muted-foreground">No saved versions.</div>
              ) : (
                versions.map((v) => (
                  <button
                    key={v.id}
                    className="w-full text-left text-xs border rounded p-2 hover:bg-muted"
                    onClick={() => loadVersion(v.id)}
                  >
                    <div className="font-medium">{v.name}</div>
                    <div className="text-muted-foreground">{v.createdAt}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={nodeModalOpen} onOpenChange={setNodeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Add node</DialogTitle>
          <input
            className="border rounded px-2 py-1 text-sm"
            aria-label="New node label"
            data-testid="graph-new-node-input"
            placeholder="New node label"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setNodeModalOpen(false)}>Cancel</Button>
            <Button onClick={addNode}>Add node</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


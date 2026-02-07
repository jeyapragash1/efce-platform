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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

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
    { id: "e1-2", source: "1", target: "2", label: "0.7", animated: true },
  ]);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [newNodeLabel, setNewNodeLabel] = React.useState("");
  const [edgeWeight, setEdgeWeight] = React.useState(0.7);
  const [nodeModalOpen, setNodeModalOpen] = React.useState(false);
  const [evidenceText, setEvidenceText] = React.useState("");
  const [evidenceNotes, setEvidenceNotes] = React.useState<{ id: string; text: string; time: string }[]>([]);
  const [versions, setVersions] = useLocalStorage<
    { id: string; name: string; createdAt: string; nodes: Node[]; edges: Edge[] }[]
  >("efce-graph-versions", []);

  // Add node
  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    const id = (nodes.length + 1).toString();
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: 200, y: 200 },
        data: { label: newNodeLabel },
        style: { borderRadius: 12, padding: 10 },
      },
    ]);
    setNewNodeLabel("");
    setNodeModalOpen(false);
  };

  // Add edge
  const onConnect = React.useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, label: `${Math.round(edgeWeight * 100)}%`, animated: true }, eds)
      ),
    [edgeWeight, setEdges]
  );

  // Remove node
  const removeNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
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
    setEdges((eds) =>
      eds.map((e) =>
        e.id === oldEdge.id
          ? { ...e, ...connection, label: `${Math.round(edgeWeight * 100)}%` }
          : e
      )
    );
  };

  const saveVersion = () => {
    const id = Math.random().toString(36).slice(2);
    setVersions((prev) => [
      {
        id,
        name: `Version ${prev.length + 1}`,
        createdAt: new Date().toLocaleString(),
        nodes,
        edges,
      },
      ...prev,
    ]);
  };

  const loadVersion = (id: string) => {
    const version = versions.find((v) => v.id === id);
    if (!version) return;
    setNodes(version.nodes);
    setEdges(version.edges);
  };

  const addEvidence = () => {
    if (!evidenceText.trim()) return;
    setEvidenceNotes((prev) => [
      { id: Math.random().toString(36).slice(2), text: evidenceText.trim(), time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
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
          <div className="text-lg font-semibold">Add node</div>
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

// src/components/risk-details-drawer.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RiskItem } from "@/types/risk";

export function RiskDetailsDrawer({ risk, open, onClose }: { risk: RiskItem | null, open: boolean, onClose: () => void }) {
  const defaultActions = React.useMemo(
    () => [
      "Deploy freeze window policy",
      "Mandatory rollback plan",
      "No-manual-config in prod (policy)",
      "Alert ACK SLA + escalation",
    ],
    []
  );
  const [actions, setActions] = React.useState<string[]>(defaultActions);
  const [actionOpen, setActionOpen] = React.useState(false);
  const [newAction, setNewAction] = React.useState("");
  const riskId = risk?.id ?? "";

  React.useEffect(() => {
    setActions(defaultActions);
    setActionOpen(false);
    setNewAction("");
  }, [defaultActions, riskId]);

  if (!risk) return null;

  const handleAddAction = () => {
    if (!newAction.trim()) return;
    setActions((prev) => [...prev, newAction.trim()]);
    setNewAction("");
    setActionOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="risk-drawer" aria-label="Risk details">
        <DialogPrimitive.Title className="text-lg font-semibold mb-2">{risk.risk}</DialogPrimitive.Title>
        <div className="flex items-center justify-between mb-2">
          <span />
          <Badge variant={risk.level === "HIGH" ? "destructive" : "secondary"}>{risk.level}</Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-2">Owner: {risk.owner}</div>
        <div className="text-xs text-muted-foreground mb-2">Status: {risk.status}</div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-sm">Mitigation Controls</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionOpen(true)}
              data-testid="risk-drawer-add-action"
            >
              Add action
            </Button>
          </div>
          <ul className="list-disc pl-5 text-xs">
            {actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        <Dialog open={actionOpen} onOpenChange={setActionOpen}>
          <DialogContent className="max-w-md">
            <DialogPrimitive.Title className="text-lg font-semibold mb-2">Add mitigation action</DialogPrimitive.Title>
            <label className="text-xs text-muted-foreground">Action
              <input
                className="mt-1 w-full border rounded px-2 py-1 text-sm"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g., Add canary rollback gate"
                data-testid="risk-action-input"
              />
            </label>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setActionOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAction} data-testid="risk-action-submit">Add</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="mb-4">
          <div className="font-medium text-sm mb-1">Linked Incidents</div>
          <ul className="list-disc pl-5 text-xs">
            <li>INC-001: Deployment cascade failure</li>
            <li>INC-002: Config drift caused memory spike</li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-medium text-sm mb-1">Status Timeline</div>
          <ul className="list-disc pl-5 text-xs">
            <li>2026-01-30: Risk created</li>
            <li>2026-01-31: Mitigation plan added</li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Button variant="default">Mark as Resolved</Button>
          <Button variant="outline" onClick={onClose} data-testid="risk-drawer-close">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

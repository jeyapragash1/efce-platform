// Copyright (c) 2026 Jeyapragash. All rights reserved.

import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const faq = [
  { q: "What is EFCE?", a: "A UI demo for analyzing failure chains using causal graphs and what-if simulation." },
  { q: "How do I use it?", a: "Incidents → open INC-001 → Graph tab → click nodes → Export PDF." },
  { q: "Is there backend?", a: "Not yet. Frontend-only now. Backend later." },
];

const shortcuts = [
  { key: "Ctrl + K", action: "Command palette (planned)" },
  { key: "Esc", action: "Close dialogs (planned)" },
  { key: "Click Node", action: "Show event details (done)" },
];

export default function HelpPage() {
  return (
    <>
      <Topbar title="Help / Docs" />

      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">EFCE Documentation</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Onboarding, shortcuts, and explanations (UI-only).
                </p>
              </div>
              <Badge variant="secondary">Docs</Badge>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-3 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium">Quick Start</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Start at Incidents → open an incident → Graph → Export PDF.
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium">Concepts</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Incident, attribution, causal graph, counterfactual, risk.
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium">Troubleshooting</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Client component errors? Move charts into “use client”.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardContent className="p-5">
            <div className="font-semibold mb-3">FAQ</div>
            <div className="space-y-3">
              {faq.map((f) => (
                <div key={f.q} className="border rounded-lg p-4">
                  <div className="text-sm font-medium">{f.q}</div>
                  <div className="text-sm text-muted-foreground mt-1">{f.a}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shortcuts */}
        <Card>
          <CardContent className="p-5">
            <div className="font-semibold mb-3">Keyboard Shortcuts</div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.key} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="text-sm font-medium">{s.key}</div>
                  <div className="text-sm text-muted-foreground">{s.action}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Next: implement Ctrl+K command palette.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


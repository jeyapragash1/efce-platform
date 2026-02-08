// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CounterfactualSim } from "@/components/counterfactual-sim";
import { useNotifications } from "@/components/notifications";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { apiClient } from "@/lib/api/client";
import type { CounterfactualItem } from "@/types/analysis";

type ScenarioState = {
  enabled: Record<string, boolean>;
  strength: Record<string, number>;
};

type StoredScenario = {
  id: string;
  name: string;
  updated: string;
  state: ScenarioState;
};

type ScenarioListItem = StoredScenario | { id: string; name: string; updated: string };

const scenarioTemplates = [
  { name: "Block late-night deploy overrides", effect: "High ROI" },
  { name: "Enforce alert ACK within 5 minutes", effect: "High ROI" },
  { name: "Prevent manual prod config changes", effect: "Medium ROI" },
];

const savedScenarios: ScenarioListItem[] = [
  { id: "SCN-11", name: "Deploy controls bundle", updated: "2026-01-31" },
  { id: "SCN-12", name: "Alert hygiene policy", updated: "2026-01-30" },
];

const widthClass = (value: number) => {
  const rounded = Math.round(value / 5) * 5;
  const clamped = Math.min(100, Math.max(0, rounded));
  return `w-[${clamped}%]`;
};

const hasState = (item: ScenarioListItem): item is StoredScenario => "state" in item;

export default function CounterfactualLabPage() {
  const baseProbability = 85;
  const { notify } = useNotifications();
  const [items, setItems] = React.useState<CounterfactualItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scenarioA, setScenarioA] = React.useState<{
    enabled: Record<string, boolean>;
    strength: Record<string, number>;
    probability: number;
    appliedDelta: number;
  } | null>(null);
  const [scenarioB, setScenarioB] = React.useState<typeof scenarioA>(null);
  const [scenarioASeed, setScenarioASeed] = React.useState<ScenarioState | null>(null);
  const [scenarioBSeed, setScenarioBSeed] = React.useState<ScenarioState | null>(null);
  const [saved, setSaved] = useLocalStorage<StoredScenario[]>("efce-scenarios", []);

  React.useEffect(() => {
    let active = true;
    apiClient
      .getCounterfactuals("INC-001")
      .then((data) => {
        if (!active) return;
        setItems(data);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const saveScenario = (name: string, state: ScenarioState) => {
    const id = Math.random().toString(36).slice(2);
    setSaved((prev) => [
      { id, name, updated: new Date().toLocaleDateString(), state },
      ...prev,
    ]);
    notify({ message: "Scenario saved", type: "success" });
  };

  const baseline = baseProbability;
  const aProb = scenarioA?.probability ?? baseline;
  const bProb = scenarioB?.probability ?? baseline;

  return (
    <>
      <Topbar title="Counterfactual Lab" />

      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">What-if Portfolio Simulator</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Model prevention controls across services and compare outcomes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Interactive</Badge>
                <Button variant="outline">New Scenario</Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Interactive scenario builder */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <CounterfactualSim
                  title="Scenario A"
                  baseProbability={baseProbability}
                  items={items}
                  initialEnabled={scenarioASeed?.enabled}
                  initialStrength={scenarioASeed?.strength}
                  onChange={(state) => setScenarioA(state)}
                />
                {loading && (
                  <div className="text-xs text-muted-foreground mt-2">Loading counterfactuals...</div>
                )}
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => scenarioA && saveScenario("Scenario A", { enabled: scenarioA.enabled, strength: scenarioA.strength })}
                >
                  Save Scenario A
                </Button>
              </div>
              <div>
                <CounterfactualSim
                  title="Scenario B"
                  baseProbability={baseProbability}
                  items={items}
                  initialEnabled={scenarioBSeed?.enabled}
                  initialStrength={scenarioBSeed?.strength}
                  onChange={(state) => setScenarioB(state)}
                />
                {loading && (
                  <div className="text-xs text-muted-foreground mt-2">Loading counterfactuals...</div>
                )}
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => scenarioB && saveScenario("Scenario B", { enabled: scenarioB.enabled, strength: scenarioB.strength })}
                >
                  Save Scenario B
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium">Scenario comparison (delta vs baseline)</div>
              <div className="mt-3 space-y-2">
                {[
                  { label: "Baseline", value: baseline },
                  { label: "Scenario A", value: aProb },
                  { label: "Scenario B", value: bProb },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-muted-foreground">{row.label}</div>
                    <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                      <div className={`h-2 bg-foreground ${widthClass(row.value)}`} />
                    </div>
                    <div className="w-10 text-xs text-muted-foreground text-right">{row.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Scenario Templates</div>
              <Button variant="outline">Browse</Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {scenarioTemplates.map((t) => (
                <div key={t.name} className="border rounded-lg p-4">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Expected: {t.effect}
                  </div>
                  <div className="mt-3">
                    <Button variant="default">Apply Template</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saved */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Saved Scenarios</div>
              <Button variant="outline">Open Library</Button>
            </div>

            <div className="mt-4 space-y-2">
              {(saved.length ? saved : savedScenarios).map((s) => (
                <div key={s.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{s.id} — {s.name}</div>
                    <div className="text-xs text-muted-foreground">Updated: {s.updated}</div>
                  </div>
                  {hasState(s) ? (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setScenarioASeed(s.state)}>Load A</Button>
                      <Button variant="outline" onClick={() => setScenarioBSeed(s.state)}>Load B</Button>
                    </div>
                  ) : (
                    <Button variant="outline">Open</Button>
                  )}
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
              <li>• Add interactive controls (switches + sliders)</li>
              <li>• Scenario comparison table (delta vs baseline)</li>
              <li>• Save scenarios to localStorage</li>
              <li>• Export scenario report to PDF</li>
              <li>• Link scenarios to Risk Registry items</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

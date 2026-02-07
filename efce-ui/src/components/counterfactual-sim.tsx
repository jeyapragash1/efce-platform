"use client";

// Helper to map percent to Tailwind width class (rounded to nearest 5%)
function percentToWidthClass(percent: number) {
  if (percent <= 0) return 'w-0';
  if (percent >= 100) return 'w-full';
  const rounded = Math.round(percent / 5) * 5;
  return `w-[${rounded}%]`;
}

import * as React from "react";
import { Switch } from "@/components/ui/switch";

type Counterfactual = {
  id: string;
  label: string;
  delta: number; // negative reduces probability
};

type CounterfactualState = {
  enabled: Record<string, boolean>;
  strength: Record<string, number>;
  probability: number;
  appliedDelta: number;
};

export function CounterfactualSim({
  baseProbability,
  items,
  title,
  initialEnabled,
  initialStrength,
  onChange,
}: {
  baseProbability: number;
  items: Counterfactual[];
  title?: string;
  initialEnabled?: Record<string, boolean>;
  initialStrength?: Record<string, number>;
  onChange?: (state: CounterfactualState) => void;
}) {
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    items.forEach((i) => (init[i.id] = initialEnabled?.[i.id] ?? false));
    return init;
  });
  const [strength, setStrength] = React.useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    items.forEach((i) => (init[i.id] = initialStrength?.[i.id] ?? 1));
    return init;
  });

  React.useEffect(() => {
    if (!initialEnabled) return;
    setEnabled((prev) => ({ ...prev, ...initialEnabled }));
  }, [initialEnabled]);

  React.useEffect(() => {
    if (!initialStrength) return;
    setStrength((prev) => ({ ...prev, ...initialStrength }));
  }, [initialStrength]);

  const appliedDelta = items.reduce((sum, i) => {
    return enabled[i.id] ? sum + i.delta * (strength[i.id] ?? 1) : sum;
  }, 0);

  const newProbability = Math.max(0, Math.min(100, baseProbability + appliedDelta));

  React.useEffect(() => {
    onChange?.({ enabled, strength, probability: newProbability, appliedDelta });
  }, [enabled, strength, newProbability, appliedDelta, onChange]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        {title ? <div className="text-xs text-muted-foreground mb-2">{title}</div> : null}
        <div className="text-sm text-muted-foreground">Baseline failure probability</div>
        <div className="text-2xl font-semibold">{baseProbability}%</div>

        <div className="mt-4 text-sm text-muted-foreground">With selected prevention controls</div>
        <div className="text-2xl font-semibold">{newProbability}%</div>

        <div className="mt-3 h-2 rounded bg-muted overflow-hidden">
          <div
            className={`h-2 bg-foreground transition-all duration-300 rounded ${percentToWidthClass(newProbability)}`}
          />
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Total reduction applied: {Math.abs(appliedDelta)}%
        </div>
      </div>

      <div className="space-y-3">
        {items.map((c) => {
          const checked = enabled[c.id];
          const projected = Math.max(0, Math.min(100, baseProbability + (checked ? appliedDelta : appliedDelta + c.delta)));

          return (
            <div key={c.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Expected reduction: {Math.abs(c.delta)}% → Projected probability:{" "}
                  <span className="font-medium">{projected}%</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={checked}
                  onCheckedChange={(v) =>
                    setEnabled((prev) => ({ ...prev, [c.id]: v }))
                  }
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={strength[c.id] ?? 1}
                  onChange={(e) =>
                    setStrength((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))
                  }
                  className="w-24"
                  aria-label={`Strength for ${c.label}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        This is a UI simulator. Later, EFCE will compute deltas from the causal graph engine.
      </p>
    </div>
  );
}

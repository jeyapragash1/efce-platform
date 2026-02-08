// CommandPalette.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { incidents } from "@/lib/mock/incidents";
import { risks } from "@/lib/mock/risks";
import { reports } from "@/lib/mock/reports";

type CommandEntry = {
  label: string;
  href: string;
  category: "Page" | "Incident" | "Risk" | "Report";
  keywords?: string[];
};

const PAGES: CommandEntry[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Incidents", href: "/dashboard/incidents" },
  { label: "Patterns", href: "/dashboard/patterns" },
  { label: "Graph Studio", href: "/dashboard/graph-studio" },
  { label: "Counterfactual Lab", href: "/dashboard/counterfactual-lab" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Risk Registry", href: "/dashboard/risk-registry" },
  { label: "Search", href: "/dashboard/search" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Help / Docs", href: "/dashboard/help" },
].map((p) => ({ ...p, category: "Page" }));

const INCIDENT_ENTRIES: CommandEntry[] = incidents.map((i) => ({
  label: `Incident ${i.id} — ${i.title}`,
  href: `/dashboard/incidents/${i.id}`,
  category: "Incident",
  keywords: [i.id, i.title, i.service, i.severity, i.status],
}));

const RISK_ENTRIES: CommandEntry[] = risks.map((r) => ({
  label: `Risk ${r.id} — ${r.risk}`,
  href: "/dashboard/risk-registry",
  category: "Risk",
  keywords: [r.id, r.risk, r.owner, r.level, r.status],
}));

const REPORT_ENTRIES: CommandEntry[] = reports.map((r) => ({
  label: `Report ${r.id} — ${r.title}`,
  href: "/dashboard/reports",
  category: "Report",
  keywords: [r.id, r.title, r.type, ...r.tags],
}));

const ENTRIES = [...PAGES, ...INCIDENT_ENTRIES, ...RISK_ENTRIES, ...REPORT_ENTRIES];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  const filtered = ENTRIES.filter((p) => {
    const q = query.toLowerCase();
    const inLabel = p.label.toLowerCase().includes(q);
    const inKeywords = p.keywords?.some((k) => k.toLowerCase().includes(q));
    return inLabel || inKeywords;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0" data-testid="command-palette">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="p-4 border-b">
          <Input
            ref={inputRef}
            aria-label="Command palette"
            data-testid="command-palette-input"
            placeholder="Type a page name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered[0]) {
                router.push(filtered[0].href);
                setOpen(false);
              }
            }}
          />
        </div>
        <div className="max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm">No matches</div>
          ) : (
            filtered.map((p, index) => (
              <button
                key={`${p.href}-${p.category}-${index}`}
                data-testid={`command-item-${p.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="w-full text-left px-4 py-2 hover:bg-muted"
                onClick={() => {
                  router.push(p.href);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.category}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Copyright (c) 2026 Jeyapragash. All rights reserved.


"use client";
import { Topbar } from "@/components/topbar";
import * as React from "react";
import { ReportPreview } from "@/components/reports/report-preview";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/notifications";
import type { ReportItem } from "@/types/report";
import { apiClient } from "@/lib/api/client";



const templates = [
  { id: "tpl-incident", name: "Incident Summary", description: "Auto-generate incident report with root causes." },
  { id: "tpl-exec", name: "Executive Summary", description: "Weekly rollup with MTTR, top risks, and KPIs." },
  { id: "tpl-risk", name: "Risk Review Pack", description: "Risk registry snapshot with mitigation status." },
];


export default function ReportsPage() {
  const [selected, setSelected] = React.useState<ReportItem | null>(null);
  const [type, setType] = React.useState<string>("All");
  const [search, setSearch] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState("");
  const [dateFromFilter, setDateFromFilter] = React.useState("2026-01-01");
  const [dateToFilter, setDateToFilter] = React.useState("2026-01-31");
  const [reports, setReports] = React.useState<ReportItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [templateId, setTemplateId] = React.useState(templates[0].id);
  const [dateFrom, setDateFrom] = React.useState("2026-01-01");
  const [dateTo, setDateTo] = React.useState("2026-01-31");
  const [tags, setTags] = React.useState("Executive, Weekly");
  const { notify } = useNotifications();

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient
      .getReports()
      .then((data) => {
        if (!active) return;
        setReports(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load reports");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const types = ["All", ...Array.from(new Set(reports.map((r) => r.type)))];
  const filtered = reports.filter((r) => {
    const matchesType = type === "All" || r.type === type;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      tagFilter.trim().length === 0 ||
      r.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
    const matchesDate = r.date >= dateFromFilter && r.date <= dateToFilter;
    return matchesType && matchesSearch && matchesTags && matchesDate;
  });

  const handleGenerate = () => {
    notify({ message: "Report generated", type: "success" });
    setWizardOpen(false);
    setStep(1);
  };

  return (
    <>
      <Topbar title="Reports" />
      <div className="p-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5 min-h-125">
        {/* Report List */}
        <div className="md:col-span-1 lg:col-span-2 border rounded-lg bg-background flex flex-col">
          <div className="p-4 border-b grid gap-2">
            <div className="flex items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-sm flex-1"
              aria-label="Search reports"
              data-testid="reports-search"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-2 py-1 text-sm"
              aria-label="Filter reports by type"
              data-testid="reports-filter"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                className="border rounded px-2 py-1 text-sm"
                aria-label="Filter reports by tag"
                placeholder="Tag (e.g. Executive)"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                aria-label="Filter reports from date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                aria-label="Filter reports to date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </div>
            ) : error ? (
              <div className="p-4 text-muted-foreground text-sm">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-muted-foreground text-sm">No reports found</div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r.id}
                  data-testid={`report-item-${r.id}`}
                  className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted ${selected?.id === r.id ? "bg-muted" : ""}`}
                  onClick={() => setSelected(r)}
                >
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm flex-1">{r.title}</div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {r.tags?.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-muted text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Preview Panel */}
        <div className="md:col-span-2 lg:col-span-3 space-y-4">
          <div className="border rounded-lg bg-background p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-sm">Templates</div>
              <Button
                size="sm"
                onClick={() => setWizardOpen(true)}
                data-testid="reports-generate"
              >
                Generate report
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  className={`text-left rounded-md border p-3 hover:bg-muted ${templateId === tpl.id ? "border-primary bg-muted/40" : ""}`}
                  onClick={() => setTemplateId(tpl.id)}
                >
                  <div className="text-sm font-medium">{tpl.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{tpl.description}</div>
                </button>
              ))}
            </div>
          </div>

          <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
            <DialogContent className="max-w-lg" data-testid="reports-wizard">
              <DialogTitle data-testid="reports-wizard-title">
                Generate Report
              </DialogTitle>
              <div className="text-xs text-muted-foreground">Step {step} of 3</div>

              {step === 1 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Choose template</div>
                  <div className="grid gap-2">
                    {templates.map((tpl) => (
                      <label key={tpl.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={templateId === tpl.id}
                          onChange={() => setTemplateId(tpl.id)}
                        />
                        {tpl.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Date range</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="text-xs text-muted-foreground">From
                      <input
                        type="date"
                        className="mt-1 w-full border rounded px-2 py-1 text-sm"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </label>
                    <label className="text-xs text-muted-foreground">To
                      <input
                        type="date"
                        className="mt-1 w-full border rounded px-2 py-1 text-sm"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Tags & delivery</div>
                  <label className="text-xs text-muted-foreground">Tags
                    <input
                      type="text"
                      className="mt-1 w-full border rounded px-2 py-1 text-sm"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </label>
                  <div className="text-xs text-muted-foreground">
                    Report will be generated as PDF with embedded graphs.
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</Button>
                ) : (
                  <Button onClick={handleGenerate}>Generate</Button>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <ReportPreview report={selected} />
        </div>
      </div>
    </>
  );
}


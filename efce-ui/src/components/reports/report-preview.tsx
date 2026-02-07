// src/components/reports/report-preview.tsx
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportItem } from "@/types/report";

export function ReportPreview({
  report,
  isLoading,
  error,
}: {
  report?: ReportItem | null;
  isLoading?: boolean;
  error?: string;
}) {
  if (isLoading) {
    return (
      <Card className="h-full" data-testid="report-preview-loading">
        <CardContent className="p-6 space-y-3">
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center" data-testid="report-preview-error">
        <CardContent>
          <div className="text-sm text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="h-full flex items-center justify-center" data-testid="report-preview-empty">
        <CardContent>
          <div className="text-muted-foreground text-sm">Select a report to preview</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" data-testid="report-preview">
      <CardContent className="p-6 space-y-2">
        <div className="text-lg font-semibold mb-2">{report.title}</div>
        <div className="text-xs text-muted-foreground mb-2">{report.type} · {report.date}</div>
        <div className="text-sm">(Preview content for <b>{report.title}</b> would appear here.)</div>
      </CardContent>
    </Card>
  );
}

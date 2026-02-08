// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <div className="border rounded-lg p-6 bg-background">
        <div className="text-lg font-semibold">Something went wrong</div>
        <div className="text-sm text-muted-foreground mt-2">
          An unexpected error occurred while loading this dashboard section.
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {error.digest ?? "EFCE-UI-ERROR"}
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}


// Copyright (c) 2026 Jeyapragash. All rights reserved.

import { DashboardShell } from "@/components/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 rounded-md bg-background px-3 py-2 text-sm shadow"
      >
        Skip to content
      </a>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}



// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { OfflineBanner } from "@/components/offline-banner";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1">
        <OfflineBanner />
        <div className="md:hidden border-b px-4 h-12 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
            Menu
          </Button>
          <span className="text-sm text-muted-foreground">EFCE</span>
        </div>

        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-background shadow-lg">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}


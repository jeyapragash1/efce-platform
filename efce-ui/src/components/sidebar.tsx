// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };
type NavSection = { title: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    title: "Core",
    items: [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/incidents", label: "Incidents" },
      { href: "/dashboard/patterns", label: "Patterns" },
      { href: "/dashboard/graph-studio", label: "Graph Studio" },
      { href: "/dashboard/counterfactual-lab", label: "Counterfactual Lab" },
      { href: "/dashboard/reports", label: "Reports" },
      { href: "/dashboard/risk-registry", label: "Risk Registry" },
    ],
  },
  {
    title: "Utilities",
    items: [
      { href: "/dashboard/search", label: "Search" },
      { href: "/dashboard/settings", label: "Settings" },
      { href: "/dashboard/help", label: "Help / Docs" },
    ],
  },
];

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn("w-72 h-screen border-r bg-background p-4 flex flex-col", className)}
      aria-label="Primary"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">EFCE</div>
        <Badge variant="secondary">UI</Badge>
      </div>

      <Separator />

      <div className="mt-4 space-y-6 flex-1 overflow-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {section.title}
            </div>

            <nav className="space-y-1" aria-label={`${section.title} navigation`}>
              {section.items.map((i) => {
                const isActive = pathname === i.href || pathname?.startsWith(`${i.href}/`);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isActive
                        ? "bg-muted text-foreground font-medium shadow-sm"
                        : "hover:bg-muted"
                    )}
                    onClick={onNavigate}
                  >
                    {i.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <Separator />

      <div className="pt-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Enterprise Failure Causality Engine</span>
          <Badge variant="outline">v0.1</Badge>
        </div>
        <div className="mt-2">Frontend-only build</div>
      </div>
    </aside>
  );
}


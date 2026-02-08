// Copyright (c) 2026 Jeyapragash. All rights reserved.

// src/components/theme-toggle.tsx
"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [dark, setDark] = React.useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2" data-testid="theme-toggle" aria-hidden="true">
        <span className="text-xs">🌞</span>
        <span className="inline-flex h-[1.15rem] w-8 rounded-full bg-input" />
        <span className="text-xs">🌙</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" data-testid="theme-toggle">
      <span className="text-xs">🌞</span>
      <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
      <span className="text-xs">🌙</span>
    </div>
  );
}


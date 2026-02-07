// src/components/theme-toggle.tsx
"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
    else if (saved === "light") setDark(false);
    else setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
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

  return (
    <div className="flex items-center gap-2" data-testid="theme-toggle">
      <span className="text-xs">🌞</span>
      <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
      <span className="text-xs">🌙</span>
    </div>
  );
}

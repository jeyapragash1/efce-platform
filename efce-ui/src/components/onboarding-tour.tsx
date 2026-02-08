// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TOUR_STEPS = [
  {
    title: "Welcome to EFCE UI!",
    content: "This quick tour will guide you through the main features of the dashboard.",
  },
  {
    title: "Command Palette",
    content: "Press Ctrl+K or click the search bar at the top to quickly find pages and actions.",
  },
  {
    title: "Theme Switcher",
    content: "Toggle between light and dark mode using the sun/moon icon in the top bar.",
  },
  {
    title: "Notifications",
    content: "Check the bell icon for global notifications and important updates.",
  },
  {
    title: "Interactive Dashboards",
    content: "Explore the dashboard sections for reports, risk registry, graph studio, and more.",
  },
  {
    title: "Need Help?",
    content: "Visit the Help section from the sidebar for documentation and support.",
  },
];

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || step >= TOUR_STEPS.length) return null;

  const { title, content } = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div className="mb-8 pointer-events-auto w-full max-w-xs">
        <Card className="shadow-2xl border-primary border-2 animate-in fade-in slide-in-from-bottom-6">
          <CardContent className="p-6 space-y-3">
            <div className="font-semibold text-lg">{title}</div>
            <div className="text-sm text-muted-foreground">{content}</div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setDismissed(true)}>
                Skip
              </Button>
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                {step === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import * as React from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileSettings } from "@/components/profile-settings";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

const SETTINGS_KEY = "efce-settings";

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, {
    includeGraph: true,
    includeExecutiveSummary: true,
    exportFormat: "PDF",
    exportWatermark: "CONFIDENTIAL",
    shortcutsEnabled: true,
  });

  return (
    <>
      <Topbar title="Settings" />


      <div className="p-6 space-y-4">
        <ProfileSettings />

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Preferences</div>
                <p className="text-sm text-muted-foreground mt-1">
                  UI-only settings for appearance, exports, and notifications.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Saved locally</Badge>
                <Button variant="outline">Save</Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-3 md:grid-cols-3">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="text-sm font-medium">Appearance</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="text-sm font-medium">Report Defaults</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Include graph</span>
                  <Switch
                    checked={settings.includeGraph}
                    onCheckedChange={(v) => setSettings((s) => ({ ...s, includeGraph: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Executive summary</span>
                  <Switch
                    checked={settings.includeExecutiveSummary}
                    onCheckedChange={(v) => setSettings((s) => ({ ...s, includeExecutiveSummary: v }))}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="text-sm font-medium">Export Defaults</div>
                <div className="text-xs text-muted-foreground">Format</div>
                <Select
                  value={settings.exportFormat}
                  onValueChange={(v) => setSettings((s) => ({ ...s, exportFormat: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">Watermark</div>
                <input
                  className="border rounded px-2 py-1 text-sm"
                  aria-label="Export watermark"
                  placeholder="CONFIDENTIAL"
                  value={settings.exportWatermark}
                  onChange={(e) => setSettings((s) => ({ ...s, exportWatermark: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-4 border rounded-lg p-4">
              <div className="text-sm font-medium">Keyboard shortcuts</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Enable shortcuts</span>
                <Switch
                  checked={settings.shortcutsEnabled}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, shortcutsEnabled: v }))}
                />
              </div>
              <div className="mt-3 text-xs text-muted-foreground grid gap-1">
                <div>Ctrl+K — Command palette</div>
                <div>Esc — Close dialogs/drawers</div>
                <div>Shift+? — Help shortcuts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="font-semibold">About</div>
            <div className="text-sm text-muted-foreground mt-2">
              EFCE UI demo build. Backend integration will be added later.
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <div className="text-xs text-muted-foreground">Version</div>
                <div className="text-sm font-medium">v0.1</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-xs text-muted-foreground">Mode</div>
                <div className="text-sm font-medium">Frontend only</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-xs text-muted-foreground">Build</div>
                <div className="text-sm font-medium">Next.js + shadcn</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

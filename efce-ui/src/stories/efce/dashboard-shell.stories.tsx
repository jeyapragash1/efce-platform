// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";

const meta: Meta = {
  title: "EFCE/Layout/Dashboard Shell",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar title="Dashboard Shell" />
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Open incidents</div>
                <div className="text-2xl font-semibold">3</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Top risk</div>
                <div className="text-base font-semibold">Deploy overrides</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Repeat rate</div>
                <div className="text-2xl font-semibold">34%</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ),
};


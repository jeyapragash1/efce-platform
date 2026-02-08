// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/ui/badge";

const meta: Meta = {
  title: "EFCE/UI/Badges",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const SeverityAndStatus: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">SEV1</Badge>
      <Badge variant="secondary">SEV2</Badge>
      <Badge variant="secondary">SEV3</Badge>
      <Badge variant="outline">OPEN</Badge>
      <Badge variant="outline">RESOLVED</Badge>
      <Badge variant="destructive">HIGH RISK</Badge>
    </div>
  ),
};


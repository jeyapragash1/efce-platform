// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReportPreview } from "@/components/reports/report-preview";

const meta: Meta<typeof ReportPreview> = {
  title: "EFCE/Reports/Preview",
  component: ReportPreview,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ReportPreview>;

export const Empty: Story = {
  args: { report: null },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Error: Story = {
  args: { error: "Failed to load report preview" },
};

export const Filled: Story = {
  args: {
    report: {
      id: "RPT-001",
      title: "Incident Report — INC-001",
      type: "Incident",
      date: "2026-01-31",
      tags: ["Incident", "PDF"],
    },
  },
};


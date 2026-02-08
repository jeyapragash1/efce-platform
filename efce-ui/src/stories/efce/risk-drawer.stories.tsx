// Copyright (c) 2026 Jeyapragash. All rights reserved.

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RiskDetailsDrawer } from "@/components/risk-details-drawer";
import { Button } from "@/components/ui/button";
import type { RiskItem } from "@/types/risk";
import { userEvent, within, screen } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const mockRisk: RiskItem = {
  id: "RISK-01",
  risk: "Unreviewed deployments in prod",
  owner: "SRE",
  level: "HIGH",
  status: "OPEN",
};

const meta: Meta = {
  title: "EFCE/Risk/Details Drawer",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

const Demo = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)} data-testid="risk-open-drawer">
        Open Drawer
      </Button>
      <RiskDetailsDrawer risk={mockRisk} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const OpenDrawer: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("risk-open-drawer"));
    const drawer = await screen.findByTestId("risk-drawer");
    expect(drawer).toBeInTheDocument();
  },
};

export const AddActionPlay: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("risk-open-drawer"));
    await userEvent.click(screen.getByTestId("risk-drawer-add-action"));
    const input = await screen.findByTestId("risk-action-input");
    await userEvent.type(input, "Enable staged rollout policy");
    await userEvent.click(screen.getByTestId("risk-action-submit"));
    await expect(screen.getByText("Enable staged rollout policy")).toBeInTheDocument();
  },
};


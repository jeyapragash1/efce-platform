import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RiskDetailsDrawer } from "@/components/risk-details-drawer";
import { Button } from "@/components/ui/button";
import type { RiskItem } from "@/types/risk";
import { userEvent, screen } from "@storybook/testing-library";
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
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <RiskDetailsDrawer risk={mockRisk} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const OpenDrawer: Story = {
  render: () => <Demo />,
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    await expect(screen.getByTestId("risk-drawer")).toBeInTheDocument();
  },
};

export const AddActionPlay: Story = {
  render: () => <Demo />,
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    await userEvent.click(screen.getByRole("button", { name: "Add action" }));
    const input = await screen.findByPlaceholderText("e.g., Add canary rollback gate");
    await userEvent.type(input, "Enable staged rollout policy");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await expect(screen.getByText("Enable staged rollout policy")).toBeInTheDocument();
  },
};

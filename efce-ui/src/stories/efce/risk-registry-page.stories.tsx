import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, screen } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Providers from "@/app/providers";
import RiskRegistryPage from "@/app/(dashboard)/dashboard/risk-registry/page";
import { apiClient } from "@/lib/api/client";

const meta: Meta = {
  title: "EFCE/Pages/Risk Registry",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <RiskRegistryPage />,
};

export const OpenDrawer: Story = {
  render: () => <RiskRegistryPage />,
  play: async () => {
    const row = await screen.findByTestId("risk-row-RISK-01");
    await userEvent.click(row);
    await expect(screen.getByTestId("risk-drawer")).toBeInTheDocument();
  },
};

const EmptyWrapper = () => {
  React.useEffect(() => {
    const original = apiClient.getRisks;
    apiClient.getRisks = async () => [];
    return () => {
      apiClient.getRisks = original;
    };
  }, []);
  return <RiskRegistryPage />;
};

const ErrorWrapper = () => {
  React.useEffect(() => {
    const original = apiClient.getRisks;
    apiClient.getRisks = async () => {
      throw new Error("Failed to load risks");
    };
    return () => {
      apiClient.getRisks = original;
    };
  }, []);
  return <RiskRegistryPage />;
};

export const EmptyState: Story = {
  render: () => <EmptyWrapper />,
  play: async () => {
    await expect(screen.getByText("No risks available.")).toBeInTheDocument();
  },
};

export const ErrorState: Story = {
  render: () => <ErrorWrapper />,
  play: async () => {
    await expect(screen.getByText("Failed to load risks")).toBeInTheDocument();
  },
};

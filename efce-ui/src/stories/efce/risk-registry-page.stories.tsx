import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, waitFor, within, screen } from "@storybook/testing-library";
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = await canvas.findByTestId("risk-row-RISK-01");
    await userEvent.click(row);
    const drawer = await screen.findByTestId("risk-drawer");
    expect(drawer).toBeInTheDocument();
  },
};

const EmptyWrapper = () => {
  const originalRef = React.useRef(apiClient.getRisks);
  apiClient.getRisks = async () => [];
  React.useEffect(() => {
    return () => {
      apiClient.getRisks = originalRef.current;
    };
  }, []);
  return <RiskRegistryPage />;
};

const ErrorWrapper = () => {
  const originalRef = React.useRef(apiClient.getRisks);
  apiClient.getRisks = async () => {
    throw new Error("Failed to load risks");
  };
  React.useEffect(() => {
    return () => {
      apiClient.getRisks = originalRef.current;
    };
  }, []);
  return <RiskRegistryPage />;
};

export const EmptyState: Story = {
  render: () => <EmptyWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const empty = await canvas.findByText("No risks available.");
    expect(empty).toBeInTheDocument();
  },
};

export const ErrorState: Story = {
  render: () => <ErrorWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      const error = await canvas.findByText("Failed to load risks");
      expect(error).toBeInTheDocument();
    });
  },
};

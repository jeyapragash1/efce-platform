import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Providers from "@/app/providers";
import ReportsPage from "@/app/(dashboard)/dashboard/reports/page";
import { apiClient } from "@/lib/api/client";

const meta: Meta = {
  title: "EFCE/Pages/Reports",
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
  render: () => <ReportsPage />,
};

export const FiltersPlay: Story = {
  render: () => <ReportsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = await canvas.findByLabelText("Search reports");
    await userEvent.type(search, "Executive");
    await expect(canvas.getByText("Weekly Executive Summary")).toBeInTheDocument();
    const typeFilter = canvas.getByLabelText("Filter reports by type") as HTMLSelectElement;
    await userEvent.selectOptions(typeFilter, "Executive");
    await expect(typeFilter.value).toBe("Executive");
  },
};

export const EmptyState: Story = {
  render: () => <EmptyApiWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const empty = await canvas.findByText("No reports found");
    expect(empty).toBeInTheDocument();
  },
};

export const WizardPlay: Story = {
  render: () => <ReportsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("reports-generate"));
    const title = await canvas.findByTestId("reports-wizard-title");
    expect(title).toBeInTheDocument();
  },
};

const EmptyApiWrapper = () => {
  const originalRef = React.useRef(apiClient.getReports);
  apiClient.getReports = async () => [];
  React.useEffect(() => {
    return () => {
      apiClient.getReports = originalRef.current;
    };
  }, []);
  return <ReportsPage />;
};

const ErrorApiWrapper = () => {
  const originalRef = React.useRef(apiClient.getReports);
  apiClient.getReports = async () => {
    throw new Error("Failed to load reports");
  };
  React.useEffect(() => {
    return () => {
      apiClient.getReports = originalRef.current;
    };
  }, []);
  return <ReportsPage />;
};

export const EmptyApiState: Story = {
  render: () => <EmptyApiWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const empty = await canvas.findByText("No reports found");
    expect(empty).toBeInTheDocument();
  },
};

export const ErrorApiState: Story = {
  render: () => <ErrorApiWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const error = await canvas.findByText("Failed to load reports");
    expect(error).toBeInTheDocument();
  },
};

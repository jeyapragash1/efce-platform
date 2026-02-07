import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, screen } from "@storybook/testing-library";
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
  play: async () => {
    const search = await screen.findByLabelText("Search reports");
    await userEvent.type(search, "Executive");
    await expect(screen.getByText("Weekly Executive Summary")).toBeInTheDocument();
    const typeFilter = screen.getByLabelText("Filter reports by type") as HTMLSelectElement;
    await userEvent.selectOptions(typeFilter, "Executive");
    await expect(typeFilter.value).toBe("Executive");
  },
};

export const EmptyState: Story = {
  render: () => <ReportsPage />,
  play: async () => {
    const search = await screen.findByLabelText("Search reports");
    await userEvent.type(search, "no-matches-expected");
    await expect(screen.getByText("No reports found")).toBeInTheDocument();
  },
};

export const WizardPlay: Story = {
  render: () => <ReportsPage />,
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Generate report" }));
    await expect(screen.getByText("Generate Report")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Generate" }));
  },
};

const EmptyApiWrapper = () => {
  React.useEffect(() => {
    const original = apiClient.getReports;
    apiClient.getReports = async () => [];
    return () => {
      apiClient.getReports = original;
    };
  }, []);
  return <ReportsPage />;
};

const ErrorApiWrapper = () => {
  React.useEffect(() => {
    const original = apiClient.getReports;
    apiClient.getReports = async () => {
      throw new Error("Failed to load reports");
    };
    return () => {
      apiClient.getReports = original;
    };
  }, []);
  return <ReportsPage />;
};

export const EmptyApiState: Story = {
  render: () => <EmptyApiWrapper />,
  play: async () => {
    await expect(screen.getByText("No reports found")).toBeInTheDocument();
  },
};

export const ErrorApiState: Story = {
  render: () => <ErrorApiWrapper />,
  play: async () => {
    await expect(screen.getByText("Failed to load reports")).toBeInTheDocument();
  },
};

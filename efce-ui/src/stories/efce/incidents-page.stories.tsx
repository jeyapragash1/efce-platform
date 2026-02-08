// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Providers from "@/app/providers";
import IncidentsPage from "@/app/(dashboard)/dashboard/incidents/page";

const meta: Meta = {
  title: "EFCE/Pages/Incidents",
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
  render: () => <IncidentsPage />,
};

export const FiltersPlay: Story = {
  render: () => <IncidentsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = await canvas.findByTestId("incidents-search");
    await userEvent.type(search, "INC-001");
    await expect(canvas.getByText("INC-001")).toBeInTheDocument();
    await expect(canvas.queryByText("INC-002")).not.toBeInTheDocument();
  },
};

export const GenerateDemoIncident: Story = {
  render: () => <IncidentsPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId("incidents-generate"));
    const ids = await canvas.findAllByText(/INC-0\d+/);
    expect(ids.length).toBeGreaterThan(0);
  },
};


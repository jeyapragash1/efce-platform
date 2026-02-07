import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, screen } from "@storybook/testing-library";
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
  play: async () => {
    const search = await screen.findByPlaceholderText("Search by ID / title / service...");
    await userEvent.type(search, "INC-001");
    await expect(screen.getByText("INC-001")).toBeInTheDocument();
    await expect(screen.queryByText("INC-002")).not.toBeInTheDocument();
  },
};

export const GenerateDemoIncident: Story = {
  render: () => <IncidentsPage />,
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Generate demo incident" }));
    await expect(screen.getByText(/INC-0\d+/)).toBeInTheDocument();
  },
};

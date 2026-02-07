import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExportIncidentPdfButton } from "@/components/export-incident-pdf";
import { NotificationsProvider } from "@/components/notifications";

const meta: Meta<typeof ExportIncidentPdfButton> = {
  title: "EFCE/Reports/Export PDF Button",
  component: ExportIncidentPdfButton,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <NotificationsProvider>
        <Story />
      </NotificationsProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExportIncidentPdfButton>;

export const Default: Story = {
  args: {
    incident: {
      id: "INC-001",
      title: "Deployment cascade failure",
      service: "payments-api",
      severity: "SEV1",
      status: "RESOLVED",
      startedAt: "2026-01-30T11:05:00+05:30",
      durationMin: 70,
    },
    timeline: ["Deploy started", "Error spikes", "Rollback initiated"],
    attribution: [
      { factor: "Config drift", contribution: 55, type: "Process" },
      { factor: "Missing alert guard", contribution: 45, type: "Monitoring" },
    ],
    counterfactuals: [
      { id: "cf-1", label: "Block manual config changes", delta: -25 },
    ],
    baseProbability: 85,
    onExport: () => {},
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

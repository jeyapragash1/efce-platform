import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotificationsProvider, NotificationBell } from "@/components/notifications";
import { userEvent, screen } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta: Meta = {
  title: "EFCE/Notifications/Bell",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const WithNotifications: Story = {
  render: () => (
    <NotificationsProvider
      initialNotifications={[
        { id: "n1", message: "Report exported", type: "success", time: "10:21 AM", read: false },
        { id: "n2", message: "Scenario saved", type: "info", time: "10:18 AM", read: true },
      ]}
    >
      <NotificationBell />
    </NotificationsProvider>
  ),
  play: async () => {
    await userEvent.click(screen.getByLabelText("Notifications"));
    await expect(screen.getByText("Notifications")).toBeInTheDocument();
    await expect(screen.getByText("Report exported")).toBeInTheDocument();
  },
};

export const MarkAllRead: Story = {
  render: () => (
    <NotificationsProvider
      initialNotifications={[
        { id: "n1", message: "Export complete", type: "success", time: "09:01 AM", read: false },
        { id: "n2", message: "Graph saved", type: "info", time: "09:02 AM", read: false },
      ]}
    >
      <NotificationBell />
    </NotificationsProvider>
  ),
  play: async () => {
    await userEvent.click(screen.getByLabelText("Notifications"));
    await userEvent.click(screen.getByText("Mark all as read"));
    await expect(screen.getByText("Export complete")).toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar } from "@/components/sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "EFCE/Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

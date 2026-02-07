import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Topbar } from "@/components/topbar";

const meta: Meta<typeof Topbar> = {
  title: "EFCE/Layout/Topbar",
  component: Topbar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Topbar>;

export const Default: Story = {
  args: {
    title: "Overview",
  },
};

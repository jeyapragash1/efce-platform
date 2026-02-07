import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';
import { userEvent, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta = {
  title: 'EFCE/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-4 border rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    const toggle = await screen.findByLabelText('Toggle dark mode');
    await userEvent.click(toggle);
    await expect(document.documentElement.classList.contains('dark')).toBe(true);
  },
};

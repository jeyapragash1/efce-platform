import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from './command-palette';
import { userEvent, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta = {
  title: 'EFCE/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div>
        <p className="text-sm text-muted-foreground mb-4">Press Ctrl+K to open command palette</p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}');
    await expect(screen.getByTestId('command-palette')).toBeInTheDocument();
    await expect(screen.getByTestId('command-palette-input')).toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { GraphEditor } from './graph-editor';

const meta = {
  title: 'EFCE/GraphEditor',
  component: GraphEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GraphEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Interactive Graph Editor</h2>
      <p className="text-sm text-muted-foreground mb-4">Add nodes, connect them, and set edge weights.</p>
      <GraphEditor />
    </div>
  ),
};

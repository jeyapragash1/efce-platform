// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react';
import { CounterfactualSim } from './counterfactual-sim';

const meta = {
  title: 'EFCE/CounterfactualSim',
  component: CounterfactualSim,
  tags: ['autodocs'],
} satisfies Meta<typeof CounterfactualSim>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockControls = [
  { id: 'cf-deploy', label: 'Block late-night deployments', delta: -55 },
  { id: 'cf-alert', label: 'Enforce alert acknowledgement', delta: -40 },
  { id: 'cf-config', label: 'Prevent manual config changes', delta: -35 },
  { id: 'cf-tests', label: 'Enforce CI test pass', delta: -28 },
];

export const Default: Story = {
  args: {
    baseProbability: 85,
    items: mockControls,
  },
};

export const HighRisk: Story = {
  args: {
    baseProbability: 95,
    items: mockControls,
  },
};

export const LowRisk: Story = {
  args: {
    baseProbability: 30,
    items: mockControls,
  },
};


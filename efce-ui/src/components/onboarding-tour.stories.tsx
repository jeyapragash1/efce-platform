// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingTour } from './onboarding-tour';

const meta = {
  title: 'EFCE/OnboardingTour',
  component: OnboardingTour,
  tags: ['autodocs'],
} satisfies Meta<typeof OnboardingTour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative h-96 bg-slate-900">
      <p className="text-white p-4">Onboarding tour appears as an overlay (see bottom right)</p>
      <OnboardingTour />
    </div>
  ),
};


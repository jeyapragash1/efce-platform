// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react';
import { ProfileSettings } from './profile-settings';

const meta = {
  title: 'EFCE/ProfileSettings',
  component: ProfileSettings,
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <ProfileSettings />
    </div>
  ),
};


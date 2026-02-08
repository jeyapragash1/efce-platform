// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type OnboardingState = {
  step: number;
  dismissed: boolean;
};

export type OnboardingUpdate = {
  step?: number;
  dismissed?: boolean;
};

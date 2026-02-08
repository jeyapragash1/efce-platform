// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type AttributionItem = {
  factor: string;
  contribution: number;
  type: string;
};

export type CounterfactualItem = {
  id: string;
  label: string;
  delta: number;
};

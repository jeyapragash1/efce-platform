// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type ScenarioState = {
  enabled: Record<string, boolean>;
  strength: Record<string, number>;
};

export type ScenarioItem = {
  id: string;
  name: string;
  updatedAt: string;
  state: ScenarioState;
};

export type ScenarioCreate = {
  name: string;
  state: ScenarioState;
};

export type ScenarioUpdate = {
  name?: string;
  state?: ScenarioState;
};

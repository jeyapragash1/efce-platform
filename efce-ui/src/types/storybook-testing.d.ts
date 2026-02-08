// Copyright (c) 2026 Jeyapragash. All rights reserved.

declare module "@storybook/testing-library" {
  export * from "@testing-library/dom";
  export { default as userEvent } from "@testing-library/user-event";
}

declare module "@storybook/jest" {
  export { expect } from "@storybook/expect";
}


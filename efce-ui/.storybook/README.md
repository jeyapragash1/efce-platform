# EFCE UI — Component Library Documentation

Welcome to the EFCE UI Storybook. This living design system documents all UI components and EFCE-specific features used in the Enterprise Failure Causality Engine dashboard.

## Getting Started

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

## Component Categories

### Core UI Components
- **Button** — All variants (default, outline, destructive, ghost, secondary) and sizes
- **Card** — Layout and grouping component with header, title, description, content
- **Badge** — Status, severity, and tag displays
- **Input** — Text input fields with validation states
- **Switch** — Toggle controls (used for theme switcher)
- **Tabs** — Multi-panel navigation (incident details, incident timeline)
- **Select** — Dropdown selects
- **Separator** — Visual dividers

### EFCE-Specific Features

#### CommandPalette
Global keyboard-driven navigation (Ctrl+K) to jump between pages and actions. Essential for power users.
- Fast page search
- Keyboard-only accessible
- Filters by page name

#### ThemeToggle
Dark/light mode switcher with localStorage persistence.
- Respects system preferences
- Persists across sessions
- Smooth transitions

#### GraphEditor
Interactive node/edge editor for building causal graphs in Graph Studio.
- Add/remove nodes
- Connect edges with weights
- Drag to reposition
- React Flow powered

#### CounterfactualSim
"What-if" simulator showing risk reduction from prevention controls.
- Baseline probability display
- Interactive control toggles
- Real-time probability calculation
- Used in Counterfactual Lab and incident details

#### ProfileSettings
User profile management (name, email, org).
- Edit mode toggle
- Form validation
- localStorage integration (ready for backend)

#### OnboardingTour
First-visit guided walkthrough introducing key features.
- 6-step tour
- Dismissible
- Fixed overlay positioning
- Card-based UI

## Running Tests

### Storybook Tests (Vitest)
```bash
npx vitest
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### E2E Tests in CI
```bash
npm run test:e2e:ci
```

## Design System Principles

1. **Accessibility First** — All components meet WCAG 2.1 AA standards
2. **Keyboard Navigation** — Every interactive element is keyboard accessible
3. **Dark Mode Ready** — Tailwind dark mode support across all components
4. **Type Safe** — Full TypeScript coverage with no `any` types
5. **shadcn/ui Foundation** — Built on Radix UI primitives for solid UX

## Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ Production | All variants tested |
| Card | ✅ Production | Layout stable |
| Badge | ✅ Production | Severity mappings included |
| CommandPalette | ✅ Production | E2E tested |
| ThemeToggle | ✅ Production | localStorage persisted |
| GraphEditor | ✅ Production | React Flow integration |
| CounterfactualSim | ✅ Production | Interactive controls working |
| ProfileSettings | ✅ Production | Edit mode working |
| OnboardingTour | ✅ Production | 6-step flow |

## Next Steps

- Link Storybook to Chromatic for visual regression testing
- Expand component library documentation with design tokens
- Add performance benchmarks for chart-heavy pages
- Document integration patterns with backend APIs

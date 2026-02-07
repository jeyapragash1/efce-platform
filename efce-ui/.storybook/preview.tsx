import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0b0b0c" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "#0b0b0c";
      return (
        <div className={isDark ? "dark" : ""}>
          <div className="min-h-screen bg-background text-foreground">
            <div className="p-6">
              <Story />
            </div>
          </div>
        </div>
      );
    },
  ],
};

export default preview;

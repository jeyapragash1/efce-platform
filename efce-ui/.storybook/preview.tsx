import type { Preview } from "@storybook/react";
import Providers from "../src/app/providers";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
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
        <Providers>
          <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-background text-foreground">
              <div className="p-6">
                <Story />
              </div>
            </div>
          </div>
        </Providers>
      );
    },
  ],
};

export default preview;

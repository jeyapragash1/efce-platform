import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent } from "@/components/ui/card";

const meta: Meta = {
  title: "EFCE/UI/Cards",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const KPIGrid: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3 w-[900px] max-w-[95vw]">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Open incidents</div>
          <div className="text-2xl font-semibold">3</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">SEV1</div>
          <div className="text-2xl font-semibold">1</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">MTTR</div>
          <div className="text-2xl font-semibold">57 min</div>
        </CardContent>
      </Card>
    </div>
  ),
};

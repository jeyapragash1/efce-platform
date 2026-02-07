import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { incidents } from "@/lib/mock/incidents";

const meta: Meta = {
  title: "EFCE/Pages/Incidents Table",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {incidents.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <Link href="#" className="font-medium underline">
                    {i.id}
                  </Link>
                </TableCell>
                <TableCell>{i.title}</TableCell>
                <TableCell>{i.service}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{i.severity}</Badge>
                </TableCell>
                <TableCell>{i.status}</TableCell>
                <TableCell>{i.durationMin} min</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="p-6">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center">
                <div className="text-sm text-muted-foreground">
                  No incidents available.
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ),
};

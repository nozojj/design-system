import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsymGrid, Card } from "@ds/ui";

const meta = {
  title: "Composition/AsymGrid",
  component: AsymGrid,
  args: {
    ratio: "2:1",
    largeSide: "start",
    gap: "md",
  },
  argTypes: {
    ratio: { control: "inline-radio", options: ["3:2", "2:1", "3:1"] },
    largeSide: { control: "inline-radio", options: ["start", "end"] },
    gap: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: (args) => (
    <AsymGrid {...args}>
      <AsymGrid.Item span="large">
        <Card>
          <Card.Title>Halden Low Table</Card.Title>
          <p>無垢のオーク材を使った、床に近い暮らしのためのテーブル。</p>
        </Card>
      </AsymGrid.Item>
      <AsymGrid.Item>
        <Card>
          <Card.Title>Oak Bench</Card.Title>
          <p>W 140 cm</p>
        </Card>
      </AsymGrid.Item>
      <AsymGrid.Item>
        <Card>
          <Card.Title>Ash Shelf</Card.Title>
          <p>在庫わずか</p>
        </Card>
      </AsymGrid.Item>
    </AsymGrid>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--ds-color-canvas)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsymGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

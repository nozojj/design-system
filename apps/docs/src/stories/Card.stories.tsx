import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "@ds/ui";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    as: "div",
  },
  argTypes: {
    as: {
      control: "inline-radio",
      options: ["div", "article", "section"],
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Title>Halden Low Table</Card.Title>
      <p>無垢のオーク材を使った、床に近い暮らしのためのテーブル。</p>
    </Card>
  ),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, padding: 24, background: "var(--ds-color-canvas)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Article: Story = {
  args: { as: "article" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 見出しの文字で article を見つけられる = aria-labelledby で結び付いている
    const card = canvas.getByRole("article", { name: "Halden Low Table" });
    await expect(card).toBeInTheDocument();
  },
};

export const ArticleWithoutTitle: Story = {
  args: { as: "article" },
  render: (args) => (
    <Card {...args}>
      <p>年末年始は発送をお休みします。</p>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Title がないときは、存在しない id を指さないよう aria-labelledby を付けない
    const card = canvas.getByRole("article");
    await expect(card).not.toHaveAttribute("aria-labelledby");
  },
};

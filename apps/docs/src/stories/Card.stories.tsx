import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button, Card } from "@ds/ui";
import "../themes/paper.css";
import { ThemePanel } from "./foundations/parts";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    size: "md",
    as: "article",
    children: null,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    as: { control: "inline-radio", options: ["article", "section", "div"] },
    children: { control: false },
  },
  decorators: [
    // Card は地（canvas）の上に置く前提なので、地の色を敷いて確認する
    (Story) => (
      <div
        style={{
          padding: 24,
          background: "var(--ds-color-canvas)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 一覧の1項目くらいの幅で確認する */
const narrow: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div style={{ maxWidth: 380 }}>
      <Story />
    </div>
  ),
];

/** 見出し・本文・操作をすべて持つ基本の形 */
export const Default: Story = {
  decorators: narrow,
  render: (args) => (
    <Card {...args}>
      <Card.Title>Halden Low Table</Card.Title>
      <Card.Body>
        <p>無垢のオーク材を使った、床に近い暮らしのためのテーブル。</p>
      </Card.Body>
      <Card.Actions>
        <Button variant="secondary" size="sm">
          詳細
        </Button>
      </Card.Actions>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 見出しがカードの名前になり、article として見つけられる
    const card = canvas.getByRole("article", { name: "Halden Low Table" });
    await expect(card).toHaveAttribute("data-size", "md");

    // 見出しのレベルは既定で h3
    await expect(canvas.getByRole("heading", { level: 3 })).toHaveTextContent("Halden Low Table");
  },
};

/** 見出しだけ・本文だけでも成り立つ。見出しがなければ aria-labelledby は付けない */
export const BodyOnly: Story = {
  decorators: narrow,
  render: (args) => (
    <Card {...args} aria-label="お知らせ">
      <Card.Body>
        <p>年末年始は 12/28〜1/4 まで発送をお休みします。</p>
      </Card.Body>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole("article", { name: "お知らせ" });
    await expect(card).not.toHaveAttribute("aria-labelledby");
  },
};

/** 一覧の中で大きく扱う1項目。余白と見出しが大きくなる */
export const Large: Story = {
  args: { size: "lg" },
  decorators: [
    (Story) => (
      <div style={{ width: 560 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <Card.Title as="h2">Oak Collection 2026</Card.Title>
      <Card.Body>
        <p>
          床に近い暮らしのための家具を、オーク材でまとめたシリーズ。テーブル、ベンチ、棚の3つから始まります。
        </p>
      </Card.Body>
      <Card.Actions>
        <Button size="md">シリーズを見る</Button>
      </Card.Actions>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("article", { name: "Oak Collection 2026" })).toHaveAttribute(
      "data-size",
      "lg",
    );
    await expect(canvas.getByRole("heading", { level: 2 })).toBeInTheDocument();
  },
};

/**
 * 見出しに href を渡すと、カード全体がリンクになる。
 * リンクは見出しの1つだけなので、読み上げやタブ移動でカードごとに何度も止まらない。
 * Card.Actions の操作は、リンクとは別に押せる。
 */
export const Linked: Story = {
  decorators: narrow,
  args: { onClick: fn() },
  render: ({ onClick, ...args }) => (
    <Card {...args}>
      <Card.Title href="#low-table">Halden Low Table</Card.Title>
      <Card.Body>
        <p>W 120 × D 60 × H 36 cm</p>
        <p>¥84,000</p>
      </Card.Body>
      <Card.Actions>
        <Button variant="secondary" size="sm" onClick={onClick}>
          比較に追加
        </Button>
      </Card.Actions>
    </Card>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // リンクは1つだけで、名前は見出しの文字
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(1);
    await expect(links[0]).toHaveAccessibleName("Halden Low Table");
    await expect(links[0]).toHaveAttribute("href", "#low-table");

    // Tab で最初にリンク、次に操作のボタンへ移る
    await userEvent.tab();
    await expect(links[0]).toHaveFocus();
    await userEvent.tab();
    const button = canvas.getByRole("button", { name: "比較に追加" });
    await expect(button).toHaveFocus();

    // ボタンはリンクの当たり判定より手前にあり、押すとボタンの処理だけが動く
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(window.location.hash).not.toBe("#low-table");

    // 本文の部分を押すとリンクとして扱われる（当たり判定がカード全体に広がっている）
    const body = canvas.getByText("¥84,000");
    const rect = body.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + 4, rect.top + rect.height / 2);
    await expect(hit).toBe(links[0]);
  },
};

/** 役割トークンだけで色と書体を決めているので、テーマを替えても部品の CSS は変わらない */
export const Themes: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const sample = (
      <Card {...args}>
        <Card.Title href="#low-table">Halden Low Table</Card.Title>
        <Card.Body>
          <p>無垢のオーク材を使った、床に近い暮らしのためのテーブル。</p>
        </Card.Body>
        <Card.Actions>
          <Button variant="secondary" size="sm">
            比較に追加
          </Button>
        </Card.Actions>
      </Card>
    );
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <ThemePanel theme="light" title="既定 / light">
          {sample}
        </ThemePanel>
        <ThemePanel theme="dark" title="既定 / dark">
          {sample}
        </ThemePanel>
        <ThemePanel theme="light" brand="paper" title="Paper / light">
          {sample}
        </ThemePanel>
        <ThemePanel theme="dark" brand="paper" title="Paper / dark">
          {sample}
        </ThemePanel>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const surfaceOf = (name: string) =>
      getComputedStyle(within(canvas.getByRole("region", { name })).getByRole("article"))
        .backgroundColor;
    await expect(surfaceOf("既定 / dark")).not.toBe(surfaceOf("既定 / light"));
    await expect(surfaceOf("Paper / light")).not.toBe(surfaceOf("既定 / light"));
  },
};

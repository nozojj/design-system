import type { Meta, StoryObj, Decorator } from "@storybook/react-vite";
import { AsymGrid, Card } from "@ds/ui";

// ---------- データ ----------
type Product = {
  name: string;
  detail: string;
};

// 1つの段に商品3つ。各段の最初の商品が「大きい子」になる
const rows: Product[][] = [
  [
    {
      name: "Halden Low Table",
      detail: "無垢のオーク材を使った、床に近い暮らしのためのテーブル。",
    },
    { name: "Oak Bench", detail: "W 140 cm" },
    { name: "Ash Shelf", detail: "在庫わずか" },
  ],
  [
    {
      name: "Linen Lounge Chair",
      detail: "麻張りの座面と低い背もたれで、長く座っていられる一脚。",
    },
    { name: "Walnut Stool", detail: "H 45 cm" },
    { name: "Paper Lamp", detail: "和紙 / 2色" },
  ],
  [
    {
      name: "Birch Sideboard",
      detail: "引き戸の奥に、器と本をまとめてしまえる収納。",
    },
    { name: "Cedar Tray", detail: "W 32 cm" },
    { name: "Wool Rug", detail: "受注生産" },
  ],
];

// ---------- 画面 ----------
function HaldenWorksPage() {
  return (
    <div
      style={{
        padding: "var(--ds-space-6)",
        background: "var(--ds-color-canvas)",
        color: "var(--ds-color-ink)",
      }}
    >
      <h1
        style={{
          margin: "0 0 var(--ds-space-6)",
          fontFamily: "var(--ds-font-display)",
        }}
      >
        Halden Works
      </h1>

      <div style={{ display: "grid", gap: "var(--ds-space-6)" }}>
        {rows.map((row, i) => (
          <AsymGrid
            key={row[0].name}
            ratio="2:1"
            largeSide={i % 2 === 0 ? "start" : "end"}
            gap="md"
          >
            {row.map((product, j) => (
              <AsymGrid.Item
                key={product.name}
                span={j === 0 ? "large" : undefined}
              >
                <Card as="article">
                  <Card.Title as="h2">{product.name}</Card.Title>
                  <p>{product.detail}</p>
                </Card>
              </AsymGrid.Item>
            ))}
          </AsymGrid>
        ))}
      </div>
    </div>
  );
}

// ---------- ストーリー ----------
const withWidth =
  (width: string): Decorator =>
  (Story) => (
    <div style={{ inlineSize: width }}>
      <Story />
    </div>
  );

const meta = {
  title: "Examples/Halden Works",
  parameters: { layout: "fullscreen" },
  render: () => <HaldenWorksPage />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  decorators: [withWidth("20rem")],
};

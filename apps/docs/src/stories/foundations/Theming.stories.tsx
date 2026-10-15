import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import "../../themes/paper.css";
import { MIN_TEXT_CONTRAST } from "./contrast";
import { ContrastTable, Specimen, ThemePanel } from "./parts";

const meta = {
  title: "Foundations/Theming",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 同じ見本を、既定テーマと別テーマ（Paper）で並べる。
 * Paper は src/themes/paper.css で役割トークンの値だけを差し替えている。
 */
export const Comparison: Story = {
  render: () => (
    <div className="fd-page">
      <section>
        <h2>別テーマの例</h2>
        <p className="fd-lead">
          見本の CSS は役割トークンしか参照していない。テーマは値を差し替えるだけで、見本の CSS は1行も変えていない。
          Paper は色を暖色に、見出しの書体だけを明朝に替えている。
        </p>
        <div className="fd-columns">
          <ThemePanel theme="light" title="既定テーマ / light">
            <Specimen />
          </ThemePanel>
          <ThemePanel theme="dark" title="既定テーマ / dark">
            <Specimen />
          </ThemePanel>
          <ThemePanel theme="light" brand="paper" title="Paper / light">
            <Specimen />
          </ThemePanel>
          <ThemePanel theme="dark" brand="paper" title="Paper / dark">
            <Specimen />
          </ThemePanel>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = (name: string) => canvas.getByRole("region", { name });

    // ページの一部だけ data-theme を変えても、その中で値が切り替わる
    const canvasOf = (name: string) => getComputedStyle(panel(name)).backgroundColor;
    await expect(canvasOf("既定テーマ / dark")).not.toBe(canvasOf("既定テーマ / light"));
    await expect(canvasOf("Paper / dark")).not.toBe(canvasOf("Paper / light"));

    // 役割の値が、テーマごとに実際に変わっている
    const giveOf = (name: string) =>
      getComputedStyle(
        within(panel(name)).getByRole("button", { name: "カートに入れる" }),
      ).backgroundColor;
    await expect(giveOf("Paper / light")).not.toBe(giveOf("既定テーマ / light"));
    await expect(giveOf("Paper / dark")).not.toBe(giveOf("Paper / light"));

    const titleFont = (name: string) =>
      getComputedStyle(within(panel(name)).getByRole("heading", { level: 4 })).fontFamily;
    await expect(titleFont("Paper / light")).not.toBe(titleFont("既定テーマ / light"));

    // 選択状態は aria-pressed で伝わり、receive の色が付く
    const paper = within(panel("Paper / light"));
    const option = paper.getByRole("button", { name: "150 cm" });
    await userEvent.click(option);
    await expect(option).toHaveAttribute("aria-pressed", "true");
    await expect(paper.getByText("150 cm", { selector: "dd" })).toBeInTheDocument();
  },
};

/** 別テーマでも、文字の組み合わせが 4.5:1 以上を保っている */
export const PaperContrast: Story = {
  render: () => (
    <div className="fd-page">
      <section>
        <h2>Paper のコントラスト比</h2>
        <p className="fd-lead">テーマを追加するときは、この表がすべて 4.5:1 以上になることを確かめる。</p>
        <div className="fd-columns">
          <ThemePanel theme="light" brand="paper" title="Paper / light">
            <ContrastTable />
          </ThemePanel>
          <ThemePanel theme="dark" brand="paper" title="Paper / dark">
            <ContrastTable />
          </ThemePanel>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll<HTMLElement>("tr[data-pair]");
    await expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const ratio = Number(row.dataset.ratio);
      await expect({ pair: row.dataset.pair, ok: ratio >= MIN_TEXT_CONTRAST }).toEqual({
        pair: row.dataset.pair,
        ok: true,
      });
    }
  },
};

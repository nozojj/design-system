import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect } from "storybook/test";
import { MIN_TEXT_CONTRAST } from "./contrast";
import { ContrastTable, ThemePanel } from "./parts";

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COLOR_ROLES = [
  ["--ds-color-canvas", "ページの地"],
  ["--ds-color-surface", "地より一段手前の面（カード、パネル）"],
  ["--ds-color-surface-sunken", "地より一段奥の面（仕様欄、入力の背景）"],
  ["--ds-color-line", "区切り線。装飾用で、部品の輪郭には使わない"],
  ["--ds-color-ink", "本文の文字と、強い塗り"],
  ["--ds-color-ink-muted", "補足の文字"],
  ["--ds-color-on-ink", "インクで塗った面の上の文字"],
  ["--ds-role-give", "送り出す側・行動を促す側。塗りとして使う"],
  ["--ds-role-on-give", "give の上の文字"],
  ["--ds-role-receive", "受け取る側・選ばれている側・基準。文字色にも使える"],
  ["--ds-role-on-receive", "receive の上の文字"],
] as const;

const LEGACY = [
  "--ds-color-bg",
  "--ds-color-bg-subtle",
  "--ds-color-fg",
  "--ds-color-fg-muted",
  "--ds-color-border",
  "--ds-color-accent",
  "--ds-color-accent-hover",
  "--ds-color-on-accent",
  "--ds-color-danger",
  "--ds-color-focus-ring",
] as const;

function Swatches({ names }: { names: ReadonlyArray<readonly [string, string]> }) {
  return (
    <ul className="fd-swatches">
      {names.map(([name, use]) => (
        <li key={name} className="fd-swatch" data-token={name}>
          <span
            className="fd-swatch__chip"
            style={{ "--fd-value": `var(${name})` } as CSSProperties}
          />
          <span className="fd-swatch__body">
            <code className="fd-swatch__name">{name}</code>
            <span className="fd-swatch__use">{use}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** 役割トークンの一覧。上のツールバーの Theme で、ライト／ダーク／OS 追従を切り替えられる */
export const Overview: Story = {
  render: () => (
    <div className="fd-page">
      <section>
        <h2>色の役割</h2>
        <p className="fd-lead">
          部品とページは、この名前だけを使う。値は既定テーマのもので、サイトごとに上書きできる。
          ライトとダークの値は <code>light-dark()</code> で1か所にまとめてあり、
          <code>color-scheme</code>（<code>data-theme</code> か OS の設定）で切り替わる。
        </p>
        <Swatches names={COLOR_ROLES} />
      </section>

      <section>
        <h2>書体の役割</h2>
        <p className="fd-lead">
          欧文は Archivo と JetBrains Mono、和文は BIZ UDゴシック。フォントを読み込まない環境では、末尾の書体で表示される。
        </p>
        <dl className="fd-type">
          <div>
            <dt>--ds-font-display</dt>
            <dd className="fd-type__display">Halden Works 2026</dd>
          </div>
          <div>
            <dt>--ds-font-ui</dt>
            <dd className="fd-type__ui">
              床に近い暮らしのための家具。Oak / Walnut / Ash の3種類から選べます。
            </dd>
          </div>
          <div>
            <dt>--ds-font-mono</dt>
            <dd className="fd-type__mono">W 120 × D 60 × H 36 cm — ¥84,000</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>v0.1 の名前（既存の部品が使用中）</h2>
        <p className="fd-lead">
          Button と TextField はまだこちらを使っている。名前と値は変えていない。役割の名前への移行は別の PR で行う。
        </p>
        <Swatches names={LEGACY.map((name) => [name, "v0.1"] as const)} />
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // すべての役割トークンに値が入っている（書き間違いや参照切れがない）
    const root = getComputedStyle(document.documentElement);
    for (const [name] of COLOR_ROLES) {
      await expect(root.getPropertyValue(name).trim()).not.toBe("");
    }
    for (const name of ["--ds-font-display", "--ds-font-ui", "--ds-font-mono", ...LEGACY]) {
      await expect(root.getPropertyValue(name).trim()).not.toBe("");
    }

    // v0.1 の名前も、ページの一部だけ data-theme="dark" にしたときに切り替わる（以前と同じ挙動）
    const probe = (theme: "light" | "dark") => {
      const wrapper = document.createElement("div");
      wrapper.dataset.theme = theme;
      const inner = document.createElement("span");
      inner.style.backgroundColor = "var(--ds-color-bg)";
      wrapper.append(inner);
      canvasElement.append(wrapper);
      const color = getComputedStyle(inner).backgroundColor;
      wrapper.remove();
      return color;
    };
    await expect(probe("dark")).not.toBe(probe("light"));

    // 色見本が透明になっていない（light-dark() が解決されている）
    const chips = canvasElement.querySelectorAll<HTMLElement>(".fd-swatch__chip");
    for (const chip of chips) {
      await expect(getComputedStyle(chip).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    }
  },
};

/** 文字として使う組み合わせのコントラスト比。ライトとダークの両方で 4.5:1 以上 */
export const Contrast: Story = {
  render: () => (
    <div className="fd-page">
      <section>
        <h2>コントラスト比</h2>
        <p className="fd-lead">
          文字として使う組み合わせを、実際に描画された色から計算している。基準は WCAG AA の 4.5:1。
          give は塗り専用なので、地の上の文字色としては使わない。
        </p>
        <div className="fd-columns">
          <ThemePanel theme="light" title="既定テーマ / light">
            <ContrastTable />
          </ThemePanel>
          <ThemePanel theme="dark" title="既定テーマ / dark">
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
      // 失敗したときに、どの組み合わせかが分かるようにする
      await expect({ pair: row.dataset.pair, ok: ratio >= MIN_TEXT_CONTRAST }).toEqual({
        pair: row.dataset.pair,
        ok: true,
      });
    }
  },
};

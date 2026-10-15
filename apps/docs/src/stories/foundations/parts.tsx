import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MIN_TEXT_CONTRAST, TEXT_PAIRS, contrastRatio } from "./contrast";
import "./foundations.css";

type Theme = "light" | "dark";

/** テーマ（とブランド）を固定した面。中では役割トークンがその値になる */
export function ThemePanel({
  theme,
  brand,
  title,
  children,
}: {
  theme?: Theme;
  brand?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="fd-panel"
      data-theme={theme}
      data-brand={brand}
      aria-label={title}
    >
      <h3>{title}</h3>
      {children}
    </section>
  );
}

/**
 * 文字として使う組み合わせのコントラスト比を、実際に描画された色から計算して表にする。
 * 各行の data-ratio を play テストで確かめる。
 */
export function ContrastTable() {
  const tableRef = useRef<HTMLTableElement>(null);

  // 描画後に色を読み取り、比を書き込む（テーマが変わるたびに再計算）
  useLayoutEffect(() => {
    const rows = tableRef.current?.querySelectorAll<HTMLTableRowElement>("tr[data-pair]");
    rows?.forEach((row) => {
      const sample = row.querySelector<HTMLElement>(".fd-contrast__sample");
      const output = row.querySelector<HTMLElement>(".fd-contrast__ratio");
      if (!sample || !output) return;
      const style = getComputedStyle(sample);
      const ratio = contrastRatio(style.color, style.backgroundColor);
      row.dataset.ratio = ratio.toFixed(2);
      output.textContent = `${ratio.toFixed(2)} : 1 ${ratio >= MIN_TEXT_CONTRAST ? "✓" : "✕"}`;
    });
  });

  return (
    <table className="fd-contrast" ref={tableRef}>
      <thead>
        <tr>
          <th scope="col">見本</th>
          <th scope="col">文字 / 背景</th>
          <th scope="col">比</th>
        </tr>
      </thead>
      <tbody>
        {TEXT_PAIRS.map(([fg, bg]) => (
          <tr key={`${fg}/${bg}`} data-pair={`${fg}/${bg}`}>
            <td>
              <span
                className="fd-contrast__sample"
                style={{ color: `var(${fg})`, backgroundColor: `var(${bg})` }}
              >
                Aa あア
              </span>
            </td>
            <td>
              <code>{fg.replace("--ds-", "")}</code>
              <br />
              <code>{bg.replace("--ds-", "")}</code>
            </td>
            <td className="fd-contrast__ratio">—</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 役割トークンだけで組んだ商品カードの見本（部品ではなく、テーマ確認用） */
export function Specimen() {
  const sizes = ["90 cm", "120 cm", "150 cm"];
  const [size, setSize] = useState(sizes[1]);

  return (
    <article className="fd-specimen">
      <p className="fd-specimen__eyebrow">No. 07 — Oak / Low table</p>
      <h4 className="fd-specimen__title">Halden Low Table</h4>
      <p className="fd-specimen__body">
        無垢のオーク材を使った、床に近い暮らしのためのテーブル。
      </p>
      <dl className="fd-specimen__specs">
        <div>
          <dt>W</dt>
          <dd>{size}</dd>
        </div>
        <div>
          <dt>H</dt>
          <dd>36 cm</dd>
        </div>
        <div>
          <dt>¥</dt>
          <dd>84,000</dd>
        </div>
      </dl>
      <div className="fd-specimen__actions" role="group" aria-label="幅">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            className="fd-specimen__option"
            aria-pressed={size === s}
            onClick={() => setSize(s)}
          >
            {s}
          </button>
        ))}
        <button type="button" className="fd-specimen__give">
          カートに入れる
        </button>
      </div>
      <a className="fd-specimen__link" href="#specs">
        寸法の詳細を見る
      </a>
    </article>
  );
}

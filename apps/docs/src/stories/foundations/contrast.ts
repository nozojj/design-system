// WCAG 2.x のコントラスト比を、ブラウザが計算した色（getComputedStyle）から求める

/** "rgb(12, 34, 56)" / "rgba(12, 34, 56, 1)" / "color(srgb 0.1 0.2 0.3)" を 0〜255 の RGB にする */
export function parseColor(value: string): [number, number, number] {
  const rgb = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  const srgb = value.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (srgb) {
    return [Number(srgb[1]) * 255, Number(srgb[2]) * 255, Number(srgb[3]) * 255];
  }

  throw new Error(`色を読み取れません: ${value}`);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(parseColor(foreground));
  const b = relativeLuminance(parseColor(background));
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/** 本文サイズの文字に求められる比（WCAG AA） */
export const MIN_TEXT_CONTRAST = 4.5;

/** 文字として使う組み合わせ。前景, 背景 の順 */
export const TEXT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["--ds-color-ink", "--ds-color-canvas"],
  ["--ds-color-ink", "--ds-color-surface"],
  ["--ds-color-ink", "--ds-color-surface-sunken"],
  ["--ds-color-ink-muted", "--ds-color-canvas"],
  ["--ds-color-ink-muted", "--ds-color-surface"],
  ["--ds-color-ink-muted", "--ds-color-surface-sunken"],
  ["--ds-role-receive", "--ds-color-canvas"],
  ["--ds-role-receive", "--ds-color-surface"],
  ["--ds-color-on-ink", "--ds-color-ink"],
  ["--ds-role-on-give", "--ds-role-give"],
  ["--ds-role-on-receive", "--ds-role-receive"],
];

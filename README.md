# design-system

[![CI](https://github.com/nozojj/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/nozojj/design-system/actions/workflows/ci.yml)

React + TypeScript で作るデザインシステムです。デザイントークン、アクセシブルなコンポーネント、Storybookによるドキュメントを、実務で使える構成で整備しています。

## 構成

pnpm workspace によるモノレポです。

```
design-system/
├─ packages/
│  ├─ tokens/   # デザイントークン（CSS変数）
│  └─ ui/       # Reactコンポーネント（@ds/ui）
└─ apps/
   └─ docs/     # Storybook
```

| パッケージ   | 役割                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| `@ds/tokens` | 色・余白・角丸・文字などのデザイントークン。ライト／ダークテーマに対応 |
| `@ds/ui`     | Reactコンポーネント。tsupでESM＋型定義＋CSSにビルド                    |
| `docs`       | Storybookによるコンポーネントのカタログとa11yチェック                  |

## 技術スタック

- React 19 / TypeScript 6
- pnpm workspace
- tsup（ライブラリのビルド）
- Storybook 10（Vite）＋ a11yアドオン
- Vitest ＋ Playwright（Storybookのストーリーをそのままテストとして実行）
- ESLint
- GitHub Actions（CI）

## 設計で意識したこと

### デザイントークンを役割で名前付けた

- **プリミティブ**：`--ds-neutral-900` や `--ds-lime-300` のような生の値。直接は使わない
- **役割**：`--ds-color-canvas`（地）、`--ds-color-ink`（文字）、`--ds-role-give`（送り出す側・行動を促す側）、`--ds-role-receive`（受け取る側・選ばれている側）、`--ds-font-display` / `--ds-font-ui` / `--ds-font-mono` のように、画面の中での役割で名前を付ける

部品とページは役割の名前だけを参照します。色や書体は「既定テーマ」の値で、サイトごとに役割の値だけを上書きすれば、部品の CSS を変えずに別のテーマになります（Storybook の Foundations/Theming に例があります）。

ライトとダークの値は `light-dark()` で1か所にまとめ、`color-scheme` で切り替えます。何も指定しなければ OS の設定に合わせ、`data-theme="light"` / `"dark"` を付けた範囲はそのテーマに固定されます。

v0.1 の名前（`--ds-color-accent` など）は、既存の Button と TextField のために値を変えずに残しています。役割の名前への移行は別の PR で行います。

### コントラスト比を確保した

文字として使う組み合わせ（文字と地、塗りとその上の文字）は、ライトとダークの両方で WCAG AA の 4.5:1 以上にしています。Storybook の Foundations/Tokens「Contrast」で、実際に描画された色から比を計算し、play テストで確かめています。

ダークモードでは、アクセント色に明るい青（blue-400）を使い、その上の文字を黒にしています。白文字と中間の青の組み合わせでは、WCAGの基準（4.5:1）を満たさないためです。

### 状態を `data-*` 属性で表現した

`<button data-variant="primary" data-size="md">` のように、バリアントやサイズを属性で表しています。クラス名を組み立てる処理が不要になり、DevToolsで状態をひと目で確認できます。

### フレームワークに依存しない作り

- スタイルは素のCSS＋CSS変数で書き、CSS-in-JSやTailwindに依存しない
- React は `peerDependencies` にして、利用側との二重読み込みを防ぐ
- ビルド時に `"use client"` を付与し、Next.js の App Router でもそのまま使える

### アクセシビリティ

- `:focus-visible` で、キーボード操作のときだけフォーカスリングを表示
- Button の `type` の初期値を `"button"` にし、フォーム内での意図しない送信を防止
- Button の loading 中は `disabled` ではなく `aria-disabled` を使い、フォーカスを失わせずにクリックだけを無効化。`aria-busy` で処理中であることを伝える
- loading 中もラベルは `opacity: 0` で残し、ボタンの幅と読み上げ用の名前を保つ
- TextField はラベルを必須の prop にし、説明文とエラーを `aria-describedby` で入力欄に紐づける
- エラーのスタイルは `[aria-invalid="true"]` に当て、見た目とa11yの状態が必ず一致するようにした
- Card は見出しがあればそれをカードの名前（`aria-labelledby`）にする。見出しに `href` を渡すとカード全体がリンクになるが、リンクは見出しの1つだけなので、読み上げやタブ移動でカードごとに何度も止まらない。中の操作ボタンはリンクとは別に押せる

### テストとCI

- Storybook のストーリーに `play` 関数で操作テストを書き、ストーリーがそのままテストになる構成
- axe による a11y チェックを `error` に設定し、違反があると CI が失敗する
- push のたびに、ビルド・テスト・型チェック・lint・Storybook のビルドを GitHub Actions で実行

## 開発

```bash
pnpm install

# Storybookを起動
pnpm --filter docs storybook

# @ds/ui を変更を監視しながらビルド
pnpm --filter @ds/ui dev
```

CIと同じチェックを手元で実行する場合：

```bash
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm build-storybook
```

## 技術的な判断のメモ

- **TypeScript は 6 系に固定**：TypeScript 7 は tsup の型定義生成（rollup-plugin-dts）に未対応だったため
- **`ignoreDeprecations: "6.0"` を設定**：tsup が内部で付与する `baseUrl` が TypeScript 6 で非推奨エラーになるため。将来的に tsdown への移行を検討

## ロードマップ

- [x] Button（variant・size・loading）
- [x] TextField（ラベル・説明・エラーの紐づけ）
- [x] インタラクションテスト＋a11yチェック（Storybook + Vitest、CIで実行）
- [ ] Checkbox / Switch
- [ ] Dialog（フォーカストラップ、Escで閉じる、フォーカスの復帰）
- [ ] Tabs（矢印キーでの移動）
- [ ] Menu
- [ ] Combobox（WAI-ARIAパターン準拠、非同期検索）
- [ ] Toast（`aria-live`）
- [ ] Storybookの公開

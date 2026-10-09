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

| パッケージ | 役割 |
|---|---|
| `@ds/tokens` | 色・余白・角丸・文字などのデザイントークン。ライト／ダークテーマに対応 |
| `@ds/ui` | Reactコンポーネント。tsupでESM＋型定義＋CSSにビルド |
| `docs` | Storybookによるコンポーネントのカタログとa11yチェック |

## 技術スタック

- React 19 / TypeScript 6
- pnpm workspace
- tsup（ライブラリのビルド）
- Storybook 10（Vite）＋ a11yアドオン
- ESLint
- GitHub Actions（CI）

## 設計で意識したこと

### デザイントークンを2層に分けた

- **プリミティブ**：`--ds-blue-600` のような生の値
- **セマンティック**：`--ds-color-accent` のような用途ベースの名前

コンポーネントはセマンティック層だけを参照します。ダークモードではセマンティック層の中身を差し替えるだけで済むため、コンポーネント側のCSSを変更せずにテーマを追加できます。

### コントラスト比を確保した

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
- Storybook の a11y アドオンで、ライト／ダーク両方の違反をチェック

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
pnpm typecheck
pnpm lint
pnpm build-storybook
```

## 技術的な判断のメモ

- **TypeScript は 6 系に固定**：TypeScript 7 は tsup の型定義生成（rollup-plugin-dts）に未対応だったため
- **`ignoreDeprecations: "6.0"` を設定**：tsup が内部で付与する `baseUrl` が TypeScript 6 で非推奨エラーになるため。将来的に tsdown への移行を検討

## ロードマップ

- [x] Button
- [ ] TextField
- [ ] Checkbox / Switch
- [ ] Dialog（フォーカストラップ、Escで閉じる、フォーカスの復帰）
- [ ] Tabs（矢印キーでの移動）
- [ ] Menu
- [ ] Combobox（WAI-ARIAパターン準拠、非同期検索）
- [ ] Toast（`aria-live`）
- [ ] インタラクションテスト（Storybook + Vitest）
- [ ] Storybookの公開

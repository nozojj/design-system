import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  // Next.js の App Router で使えるよう、先頭に "use client" を付ける
  banner: { js: '"use client";' },
});

import { defineConfig } from "bunup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  target: "browser",
  banner: '"use client";',
});

import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/schemas/index.ts", "src/errors.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  platform: "neutral",
});
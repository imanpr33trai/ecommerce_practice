// packages/db/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  // tsconfig: "./tsconfig.json",
  dts: true,
  clean: true,
  splitting: true,
  // Ensure the generated client is NOT bundled into the output,
  // but let tsup know where to find the types for .d.ts generation.
  external: [/^\.prisma\/client/],
  minify: true,
});

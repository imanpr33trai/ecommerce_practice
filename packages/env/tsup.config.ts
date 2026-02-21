import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/env.ts"],
  format: ["esm"],
  dts: true, // This is where the TS6307 error triggers
  clean: !options.watch,
  splitting: true,
  // tsconfig: "./tsconfig.json", // Explicitly point to local config
  skipNodeModulesBundle: true,
}));

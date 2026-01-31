import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true, // This is where the TS6307 error triggers
  clean: true,
  splitting: true,
  // tsconfig: "./tsconfig.json", // Explicitly point to local config
  skipNodeModulesBundle: true,
});

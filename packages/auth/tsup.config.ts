// packages/auth/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: options.watch ? "inline" : true,
  minify: false,

  external: ["@ecomerceNextjs/db", "better-auth", "zod"],

  // Reduce rebuild frequency
  ignoreWatch: ["**/*.test.ts", "**/*.spec.ts", "dist/**"],
}));

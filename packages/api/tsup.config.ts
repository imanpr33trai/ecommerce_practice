import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  sourcemap: options.watch ? "inline" : true,
  minify: false,

  // External dependencies to speed up builds
  external: [
    "hono",
    "@hono/zod-validator",
    "zod",
    "@ecomerceNextjs/auth",
    "@ecomerceNextjs/db",
    "@ecomerceNextjs/env",
  ],

  // Reduce rebuild frequency
  ignoreWatch: ["**/*.test.ts", "**/*.spec.ts", "dist/**"],
}));

// packages/db/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",

  dts: true,
  clean: !options.watch,

  // 🔥 CRITICAL: do NOT bundle or minify Prisma
  splitting: false,
  minify: false,

  // Optimize for development speed
  sourcemap: options.watch ? "inline" : true,

  external: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "@prisma/client-runtime-utils",
    "dotenv",
    "pg",
    "fs",
    "path",
    "os",
  ],

  // Reduce rebuild frequency
  ignoreWatch: ["**/*.test.ts", "**/*.spec.ts", "dist/**"],
}));

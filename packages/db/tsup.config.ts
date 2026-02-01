// packages/db/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",

  dts: true,
  clean: true,

  // 🔥 CRITICAL: do NOT bundle or minify Prisma
  splitting: false,
  minify: false,

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
});

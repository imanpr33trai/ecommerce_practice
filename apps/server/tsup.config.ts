// apps/server/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"], // Modern APIs should generally use ESM
  target: "node20", // Match your server environment
  clean: !options.watch,
  minify: true,
  dts: true,
  sourcemap: true,
  // Bundle internal workspace packages (@repo/api, @repo/db)
  // but keep external npm packages as dependencies
  noExternal: [/^@repo\/.*/],
  // If using @hono/node-server, you might want to keep it external
  external: ["@hono/node-server"],
}));

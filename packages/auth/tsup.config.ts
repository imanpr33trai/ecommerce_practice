// packages/auth/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: !options.watch,
  splitting: true,
  external: ["@ecommerceNextjs/db"], // Don't bundle the DB into the Auth package
}));

// packages/auth/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
  external: ["@ecomerceNextjs/db"], // Don't bundle the DB into the Auth package
});

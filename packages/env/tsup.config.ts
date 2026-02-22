import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/server.ts", "src/web.ts"],
  format: ["esm"],
  dts: true,
  clean: !options.watch,
  splitting: false,
  external: ["dotenv", "zod"],
}));

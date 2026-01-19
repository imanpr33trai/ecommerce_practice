import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",

  bundle: true,
  platform: "node",
  format: "esm",
  target: "es2022",

  sourcemap: true,
  minify: true,

  // VERY IMPORTANT: do NOT bundle these
  external: ["@ecomerceNextjs/*", "@prisma/client", "@prisma/adapter-pg", ".prisma/client"],

  logLevel: "info",
});

console.log("✅ Server build completed");

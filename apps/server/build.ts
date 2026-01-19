// build.ts
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

  // ADD 'hono' TO EXTERNAL
  // This allows Vercel's scanner to detect the hono dependency in the final bundle
  external: ["hono", "@ecomerceNextjs/*", "@prisma/client", "@prisma/adapter-pg", ".prisma/client"],

  logLevel: "info",
});

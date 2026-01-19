// build.ts

await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",

  format: "esm",
  target: "browser",
  sourcemap: true,
  minify: true,

  // ADD 'hono' TO EXTERNAL
  // This allows Vercel's scanner to detect the hono dependency in the final bundle
  external: ["hono", "@ecomerceNextjs/*", "@prisma/client", "@prisma/adapter-pg", ".prisma/client"],
});
export {};

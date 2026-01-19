// build.ts (using Bun's native bundler)
await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  target: "browser", // Vercel's Bun runtime prefers this for ESM compatibility
  minify: true,
  external: ["@prisma/client", ".prisma/client"],
});
console.log("✅ Build complete with Bun");

export {};

import { resolve } from "path";

async function buildServer() {
  try {
    console.log("🔨 Building server with Bun...");

    const result = await Bun.build({
      entrypoints: [resolve("src/index.ts")],
      outdir: resolve("dist"),
      target: "node",
      format: "esm",
      sourcemap: true,
      minify: process.env.NODE_ENV === "production",
      external: [
        "hono",
        "@hono/node-server",
        "@ecomerceNextjs/api",
        "@ecomerceNextjs/auth",
        "@ecomerceNextjs/db",
        "@ecomerceNextjs/env",
        "@prisma/client",
        "@prisma/adapter-pg",
        ".prisma/client",
        "pg",
        "dotenv",
      ],
    });

    if (!result.success) {
      console.error("❌ Build failed");
      for (const log of result.logs) {
        console.error(log);
      }
      process.exit(1);
    }

    console.log("✅ Server built successfully!");
    console.log(`📦 Output: dist/index.js`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildServer();

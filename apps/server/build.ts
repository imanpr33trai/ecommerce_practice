import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildServer() {
  try {
    console.log("🔨 Building server for Node.js runtime with Bun...");

    const result = await Bun.build({
      entrypoints: [resolve(__dirname, "src/index.ts")],
      outdir: resolve(__dirname, "dist"),
      target: "node",
      format: "esm",

      // Production optimizations
      minify: process.env.NODE_ENV === "production",
      sourcemap: "external",

      // Split chunks for better caching (optional)
      splitting: false,

      // Keep external dependencies that shouldn't be bundled
      external: [
        // Prisma must stay external
        "@prisma/client",
        ".prisma/client",
        // Dotenv should be external for Node.js
        "dotenv",
      ],

      // Naming
      naming: {
        entry: "index.js",
      },
    });

    if (!result.success) {
      console.error("❌ Build failed:");
      for (const log of result.logs) {
        console.error(log);
      }
      process.exit(1);
    }

    console.log("✅ Server built successfully!");
    console.log(`📦 Output: dist/index.js`);
    console.log(`📊 Outputs: ${result.outputs.length} file(s)`);

    for (const output of result.outputs) {
      const size = (output.size / 1024).toFixed(2);
      console.log(`   - ${output.path} (${size} KB)`);
    }

    console.log("🚀 Ready for deployment!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildServer();

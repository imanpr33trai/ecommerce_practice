import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bundleServer() {
  try {
    console.log("🔨 Building server for Vercel (Node.js runtime)...");

    await build({
      entryPoints: [path.resolve(__dirname, "src/index.vercel.ts")],
      bundle: true,
      platform: "node",
      target: "node20",
      outfile: path.resolve(__dirname, "dist/index.js"),
      format: "esm",
      minify: false,
      sourcemap: true,
      packages: "bundle",
      // Resolve workspace packages
      alias: {
        "@ecomerceNextjs/env": path.resolve(__dirname, "../../packages/env/src/index.ts"),
        "@ecomerceNextjs/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
        "@ecomerceNextjs/auth": path.resolve(__dirname, "../../packages/auth/src/index.ts"),
        "@ecomerceNextjs/api": path.resolve(__dirname, "../../packages/api/src/index.ts"),
      },
      // Only mark native modules as external
      external: [
        "pg",
        "dotenv",
      ],
      logLevel: "info",
    });

    console.log("✅ Server built successfully for Vercel!");
    console.log(`📦 Output: dist/index.js`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

bundleServer();

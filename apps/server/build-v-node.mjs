import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildServer() {
  try {
    console.log("🔨 Building server for Vercel (Node.js runtime) with esbuild...");

    await build({
      entryPoints: [path.resolve(__dirname, "src/index.vercel.ts")],
      bundle: true,
      platform: "node",
      target: "node20",
      outfile: path.resolve(__dirname, "dist/index.js"),
      format: "esm",
      minify: true,
      external: [
        "@prisma/client",
        ".prisma/client"
      ],
      banner: {
        js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
      },
      logLevel: "info",
    });

    console.log("✅ Server built successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildServer();

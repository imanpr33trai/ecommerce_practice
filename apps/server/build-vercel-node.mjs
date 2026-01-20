import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bundleForVercelNode() {
    try {
        console.log("🔨 Building server for Vercel Node.js runtime with Bun...");

        const result = await Bun.build({
            entrypoints: [path.resolve(__dirname, "src/index.ts")],
            outdir: path.resolve(__dirname, "dist"),
            target: "node",
            format: "esm",
            sourcemap: true,
            minify: false,
            packages: "bundle",
            external: [
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

        console.log("✅ Server built successfully for Vercel Node.js!");
        console.log(`📦 Output: dist/index.js`);
    } catch (error) {
        console.error("❌ Build failed:", error);
        process.exit(1);
    }
}

bundleForVercelNode();

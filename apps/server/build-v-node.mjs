import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Get the Node.js built-in modules list
const builtinModules = [
  "assert", "async_hooks", "buffer", "child_process", "cluster", "console",
  "constants", "crypto", "dgram", "diagnostics_channel", "dns", "domain",
  "events", "fs", "fs/promises", "http", "http2", "https", "inspector",
  "module", "net", "os", "path", "perf_hooks", "process", "punycode",
  "querystring", "readline", "repl", "stream", "stream/promises", "string_decoder",
  "sys", "timers", "timers/promises", "tls", "trace_events", "tty", "url",
  "util", "v8", "vm", "wasi", "worker_threads", "zlib"
];

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
      // Add banner with proper require function for Node.js
      banner: {
        js: `import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);`,
      },
      // Resolve workspace packages
      alias: {
        "@ecomerceNextjs/env": path.resolve(__dirname, "../../packages/env/src/index.ts"),
        "@ecomerceNextjs/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
        "@ecomerceNextjs/auth": path.resolve(__dirname, "../../packages/auth/src/index.ts"),
        "@ecomerceNextjs/api": path.resolve(__dirname, "../../packages/api/src/index.ts"),
      },
      // Mark built-in Node modules as external
      external: [
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
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

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.tsx"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist", "**/*.e2e.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mock*",
        ".next/",
        "dist/",
        "coverage/",
      ],
    },
    // Mock modules
    deps: {
      inline: ["@ecommerceNextjs/auth", "@ecommerceNextjs/api"],
    },
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ecommerceNextjs/api": path.resolve(__dirname, "../../packages/api/src"),
      "@ecommerceNextjs/auth": path.resolve(__dirname, "../../packages/auth/src"),
      "@ecommerceNextjs/types": path.resolve(__dirname, "../../packages/types/src"),
      "@ecommerceNextjs/env": path.resolve(__dirname, "../../packages/env/src"),
      "@ecommerceNextjs/config": path.resolve(__dirname, "../../packages/config"),
      "@ecommerceNextjs/db": path.resolve(__dirname, "../../packages/db/src"),
      "@workspace/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  // Define global constants for testing
  define: {
    "process.env.NEXT_PUBLIC_API_URL": '"http://localhost:3000"',
    "process.env.NODE_ENV": '"test"',
  },
});
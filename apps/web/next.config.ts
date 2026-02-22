import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@ecomerceNextjs/api",
    "@ecomerceNextjs/auth",
    "@ecomerceNextjs/db",
    "@ecomerceNextjs/env",
  ],
  typedRoutes: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Enable proper build mode for containers
  poweredByHeader: false,
  // CRITICAL: Required for Docker standalone build
  // output: "standalone",
  // Optimize for containerized environments
  experimental: {
    typedEnv: true,
    viewTransition: true,
    // Ensure standalone includes all necessary files
    // outputFileTracingRoot: "./",
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  // Production Docker optimizations
  ...(process.env.NODE_ENV === "production" && {
    output: "standalone",
  }),
};

export default nextConfig;

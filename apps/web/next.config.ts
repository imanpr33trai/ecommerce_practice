import type { NextConfig } from "next";

import { nextEnv } from "src/env";

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
  // Optimize for containerized environments
  experimental: { typedEnv: true, viewTransition: true },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  // Production Docker optimizations
  ...(nextEnv.NODE_ENV === "production" && {
    output: "standalone",
  }),
};

export default nextConfig;

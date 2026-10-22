import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@ecommerceNextjs/api",
    "@ecommerceNextjs/auth",
    "@ecommerceNextjs/db",
    "@ecommerceNextjs/env",
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
};

export default nextConfig;

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
};

export default nextConfig;

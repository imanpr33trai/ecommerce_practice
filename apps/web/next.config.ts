import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@workspace/ui", "@ecomerceNextjs/api", "@ecomerceNextjs/auth", "@ecomerceNextjs/db", "@ecomerceNextjs/env"],
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
  async rewrites(){
    return [
      {source:"/api/:path*",destination: "http://localhost:3001/api/:path*", // Proxy to Hono
            },
            {
              source: "/trpc/:path*",
              destination: "http://localhost:3001/trpc/:path*", // Proxy tRPC too
            },
    ]
  }
};

export default nextConfig;

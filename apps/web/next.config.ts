import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@ecomerceNextjs/api",

    "@ecomerceNextjs/db",
  ],
  serverExternalPackages: ["better-auth", "@ecomerceNextjs/auth"],
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true, // Temporarily disabled due to build issues
  },
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: true,
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "X-DNS-Prefetch-Control",
  //           value: "on",
  //         },
  //         {
  //           key: "X-XSS-Protection",
  //           value: "1; mode=block",
  //         },
  //       ],
  //     },
  //   ];
  // },
  // async rewrites() {
  //   return {
  //     beforeFiles: [
  //       {
  //         source: "/api/:path*",
  //         destination: "https://your-server.vercel.app/api/:path*",
  //       },
  //     ],
  //   };
  // },
};

export default nextConfig;

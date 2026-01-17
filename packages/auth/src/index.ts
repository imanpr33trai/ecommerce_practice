import prisma from "@ecomerceNextjs/db";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth<BetterAuthOptions>({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: "https://ecommerce-practice-server.vercel.app",
  trustedOrigins: [
    "https://ecommerce-practice-server.vercel.app/", // Next.js dev
    // API server
    // Add production URLs
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [openAPI()],
  secret: Bun.env.BETTER_AUTH_SECRET,
  advanced: {
    defaultCookieAttributes: {
      sameSite: Bun.env.NODE_ENV === "production" ? "lax" : "lax",
      secure: true,
      httpOnly: true,
    },
    cookiePrefix: "better-auth",
    // crossSubDomainCookies: {
    //   enabled: true,
    // },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

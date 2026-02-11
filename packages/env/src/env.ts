import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Fixed: Added .string() before .url()
    SERVER_URL: z.url().optional(),
    DATABASE_URL: z.string().optional(),
    CORS_ORIGIN: z.url().optional(),
    BETTER_AUTH_SECRET: z.string().optional(),
    BETTER_AUTH_URL: z.url().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  clientPrefix: "NEXT_PUBLIC_",

  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1).optional(),
    // Fixed: Added .string() before .url()
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url().optional(),
    NEXT_PUBLIC_API_URL: z.url().optional(),
  },

  // Manual destructuring is safer for bundlers like Next.js/Vite
  runtimeEnv: {
    SERVER_URL: process.env.SERVER_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  emptyStringAsUndefined: true,
});

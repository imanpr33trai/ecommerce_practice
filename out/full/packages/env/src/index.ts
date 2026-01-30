import "dotenv/config"; // ✅ loads .env automatically

import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  BETTER_AUTH_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  // biome-ignore lint/style/noProcessEnv: This package is responsible for reading environment variables
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // biome-ignore lint/suspicious/noConsole: Critical error logging during startup
    console.error("❌ Environment Validation Failed:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";

import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    SERVER_URL: z.url().optional(),

    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

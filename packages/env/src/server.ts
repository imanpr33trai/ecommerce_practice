import { z } from "zod";

export const serverEnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),

    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const serverEnv = serverEnvSchema.parse(process.env);

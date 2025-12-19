import { z } from "zod";

export const clientEnvSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
});

export const clientEnv = clientEnvSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

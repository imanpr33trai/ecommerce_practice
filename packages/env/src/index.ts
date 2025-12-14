import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),

  AUTH_SECRET: z.string(),
  NEXT_PUBLIC_API_URL: z.string().url(),

  // Add more env values as you need
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;

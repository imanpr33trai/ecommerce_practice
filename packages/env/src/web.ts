import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url(),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    // Fixed: Added .string() before .url()
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
    NEXT_PUBLIC_API_URL: z.url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
  emptyStringAsUndefined: true,
});

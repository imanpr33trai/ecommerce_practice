import { env } from "@ecomerceNextjs/env";
import { createEnv } from "@t3-oss/env-nextjs";

export const nextEnv = createEnv({
  extends: [env],
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});

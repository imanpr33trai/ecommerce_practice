import type { z } from "zod";

import type { envSchema } from "./index"; // Path to your Zod schema

type EnvSchemaType = z.infer<typeof envSchema>;

declare module "bun" {
  // This is the specific interface Bun uses for Bun.env
  interface Env extends EnvSchemaType {}
}

// Keep this to avoid errors in files still using process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}

// declare module "bun" {
//   interface Env {
//     DATABASE_URL: string;
//     BETTER_AUTH_SECRET: string;
//     NEXT_PUBLIC_API_URL: string;
//     BETTER_AUTH_URL: string;
//     CORS_ORIGIN: string;
//     // add more here
//   }
// }

// export {};

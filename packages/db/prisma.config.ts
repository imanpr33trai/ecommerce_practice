import path from "node:path";

import { defineConfig } from "prisma/config";

import { env } from "../env/env";

// dotenv.config({ path: "../../.env.development" });

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    seed: "tsx prisma/seed.js",
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env.DATABASE_URL,
    // url: env("DATABASE_URL"),
  },
});

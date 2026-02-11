import path from "node:path";

// import "@ecomerceNextjs/env";
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

// dotenv.config({ path: "../../.env.development" });

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    seed: "tsx prisma/seed.ts",
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

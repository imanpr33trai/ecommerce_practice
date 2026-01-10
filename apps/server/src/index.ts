import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { api } from "@ecomerceNextjs/api";
import { auth } from "@ecomerceNextjs/auth";
import { serve } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getRouterName, showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import type { HonoEnv } from "@ecomerceNextjs/api/context";

const app = new Hono<HonoEnv>()

  .use(logger())
  .use(
    "/*",
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3001",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )

  .basePath("/api")
  .route("/", api)
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  // 1. Session Middleware: Fetch once per request

  .get("/", (c) => {
    return c.text("OK");
  });

showRoutes(app, {
  colorize: true,
  verbose: true,
});

console.log(getRouterName(app));
// export default app;

const port = 3000;
console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof app;

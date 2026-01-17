import "dotenv";

import { api } from "@ecomerceNextjs/api";
import { auth } from "@ecomerceNextjs/auth";
import { serve } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { HonoEnv } from "@ecomerceNextjs/api/context";

const app = new Hono<HonoEnv>()

  .use(logger())
  .use(
    "*",
    cors({
      origin: Bun.env.CORS_ORIGIN,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

serve({
  port: 3000,
  fetch: app.fetch,
});
// showRoutes(app, {
//   colorize: true,
//   verbose: true,
// });

// console.log(getRouterName(app));

// const port = 3000;
// console.log(`Server is running on port ${port}`);
// serve({
//   fetch: app.fetch,
//   port,
// });

export type AppType = typeof app;

import { api } from "@ecomerceNextjs/api";
import type { HonoEnv } from "@ecomerceNextjs/api/context";
import { auth } from "@ecomerceNextjs/auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<HonoEnv>()
  .use(logger())
  .use(
    "*",
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3001",
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .basePath("/api")
  .route("/", api)
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .get("/d", (c) => {
    return c.text("OK");
  });

// Start server based on runtime
const port = Number(process.env.PORT) || 3000;

/**
 * 1. RUNTIME STARTUP LOGIC
 * We check the environment without using top-level exports inside blocks.
 */
if (typeof Bun !== "undefined") {
  // In Bun, we don't need to call a function;
  // exporting the object at the bottom handles it.
  console.log(`🚀 Server running on http://localhost:${port} (Bun)`);
} else if (process.env.NODE_ENV !== "production") {
  // If in Node.js (and not on a platform like Vercel which handles its own fetch)
  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`🚀 Server running on http://localhost:${info.port} (Node.js)`);
    },
  );
}

/**
 * 2. EXPORTS
 * This satisfies both Bun (which looks for fetch/port) and Vercel/Node (which looks for the app)
 */
// export default {
//   port,
//   fetch: app.fetch,
// };

// If using Vercel or standard Hono RPC, you often need the app exported too
export default app;
export type AppType = typeof app;

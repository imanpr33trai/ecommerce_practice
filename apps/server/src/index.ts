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

// Export for other modules
export { app };

// Start server based on runtime
const port = Number(process.env.PORT) || 3000;

/**
 * Start server in Node.js environment (not on Vercel)
 */
if (process.env.NODE_ENV !== "production") {
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

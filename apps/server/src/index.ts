import { api, type HonoEnv } from "@ecomerceNextjs/api";
import { auth } from "@ecomerceNextjs/auth";
import { env } from "@ecomerceNextjs/env/server";
import { serve } from "@hono/node-server";
import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

// import type { HonoEnv } from "@ecomerceNextjs/api";

const app = new Hono<HonoEnv>()
  .use(
    "*",
    secureHeaders({
      // Disable CSP for API
      crossOriginEmbedderPolicy: false,
    }),
  )
  .use("*", requestId())
  .use("*", timing())
  .use(logger())
  .use(
    "*",
    cors({
      origin: env.CORS_ORIGIN || "http://localhost:3001",
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
    }),
  )
  .basePath("/api")
  .route("/", api)
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))

  .get("/", (c) => c.text(env.DATABASE_URL || "No DATABASE_URL"));

serve({
  fetch: app.fetch,
  port: 3000,
});

/* ------------------------------------------------------------------ */
/* EXPORTS — Node.js runtime handler for Vercel                       */
/* ------------------------------------------------------------------ */

// Vercel Node.js runtime expects a default exported handler function.
// export default async function handler(request: Request) {
//   return app.fetch(request);
// }
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export default app;

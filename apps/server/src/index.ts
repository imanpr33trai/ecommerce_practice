import type { HonoEnv } from "@ecomerceNextjs/api";
import { api } from "@ecomerceNextjs/api";
import { auth } from "@ecomerceNextjs/auth";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

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
      origin: process.env.CORS_ORIGIN || "http://localhost:3001",
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
    }),
  )
  .basePath("/api")
  .route("/", api)
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .get("/health", (c) =>
    c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV,
    }),
  )
  .get("/", (c) => c.text("OK"));

/* ------------------------------------------------------------------ */
/* EXPORTS — Node.js runtime handler for Vercel                       */
/* ------------------------------------------------------------------ */

// Vercel Node.js runtime expects a default exported handler function.
export default async function handler(request: Request) {
  return app.fetch(request);
}

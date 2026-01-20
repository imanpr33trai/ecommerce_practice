import { api } from "@ecomerceNextjs/api";
import { auth } from "@ecomerceNextjs/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { HonoEnv } from "@ecomerceNextjs/api";

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
  .get("/", (c) => c.text("OK"));

/* ------------------------------------------------------------------ */
/* EXPORTS — Node.js runtime handler for Vercel                       */
/* ------------------------------------------------------------------ */

export type AppType = typeof app;

// Vercel Node.js runtime expects a default exported handler function.
export default async function handler(request: Request) {
  return app.fetch(request);
}

// /* ------------------------------------------------------------------ */
// /* LOCAL DEV ONLY (SAFE) */
// /* ------------------------------------------------------------------ */
// const port = Number(process.env.PORT) || 3000;

// if (process.env.NODE_ENV !== "production") {
//   if (typeof Bun !== "undefined") {
//     Bun.serve({
//       port,
//       fetch: app.fetch,
//     });
//     console.log(`🚀 Server running on http://localhost:${port} (Bun)`);
//   } else {
//     serve(
//       {
//         fetch: app.fetch,
//         port,
//       },
//       (info) => {
//         console.log(`🚀 Server running on http://localhost:${info.port} (Node.js)`);
//       },
//     );
//   }
// }

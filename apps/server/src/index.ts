import { api } from "@ecomerceNextjs/api";
import { auth } from "@ecomerceNextjs/auth";
import { prisma } from "@ecomerceNextjs/db";
import { serve } from "@hono/node-server";
import { handle } from "@hono/node-server/vercel";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import type { HonoEnv } from "@ecomerceNextjs/api";

interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  app: "server";
  version?: string;
  uptime: number;
  environment: string;
  database: {
    status: "connected" | "disconnected";
    error?: string;
  };
  memory: {
    used: number;
    total: number;
  };
  environment_variables: {
    NODE_ENV: string;
    DATABASE_URL: string;
    PORT: string;
  };
}
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
  .get("/health", async (c: Context): Promise<Response> => {
    try {
      // Check database connectivity
      let dbStatus: "connected" | "disconnected" = "disconnected";
      let dbError: string | undefined;

      try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = "connected";
      } catch (error) {
        dbError = error instanceof Error ? error.message : "Unknown error";
        // Use proper logger in production
        // Production logging would go to proper logging service
        // Development-only logging - replace with structured logging in production
        if (process.env.NODE_ENV === "development") {
          console.error("Database health check failed:", error);
        }
      }

      // Check environment variables
      const envVars = {
        NODE_ENV: process.env.NODE_ENV || "development",
        DATABASE_URL: process.env.DATABASE_URL ? "configured" : "missing",
        PORT: process.env.PORT || "3001",
      };

      const healthStatus: HealthResponse = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        app: "server",
        version: process.env.npm_package_version || "unknown",
        uptime: process.uptime(),
        environment: envVars.NODE_ENV,
        database: {
          status: dbStatus,
          error: dbError,
        },
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        },
        environment_variables: envVars,
      };

      // Determine HTTP status based on overall health
      const httpStatus = dbStatus === "connected" ? 200 : 503;

      return c.json(healthStatus, httpStatus);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Health check error:", error);
      }

      const errorResponse = {
        status: "unhealthy" as const,
        timestamp: new Date().toISOString(),
        app: "server" as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      return c.json(errorResponse, 503);
    }
  })
  .get("/", (c) => c.text("OK"));

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

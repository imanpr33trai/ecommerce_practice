import { auth } from "@ecomerceNextjs/auth";
import { env } from "@ecomerceNextjs/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";

import { databaseMiddleware } from "./middleware/database";
import { errorHandler } from "./middleware/error-handler";
import { rateLimit } from "./middleware/rate-limit";

const app = new Hono();

// Security middleware
app.use(
  "*",
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Development middleware
if (env.NODE_ENV !== "production") {
  app.use("*", logger());
  app.use("*", prettyJSON());
}

// Performance and monitoring middleware
app.use("*", requestId());
app.use("*", timing());
app.use("*", rateLimit());

// Database middleware
app.use("*", databaseMiddleware());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: env.NODE_ENV,
  });
});

// API routes
app.route("/api/auth", auth);

// Error handler (must be last)
app.onError(errorHandler);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Route not found" }, 404);
});

export default app;

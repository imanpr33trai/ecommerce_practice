import { createContext } from "@ecomerceNextjs/api/context";
import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { auth } from "@ecomerceNextjs/auth";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import * as dotenv from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers"; // 1. Import Security Headers

// Load env vars
dotenv.config({ path: "../../.env" });

const app = new Hono();

// --- Middleware ---

// 1. Logger
app.use(logger());

// 2. Security Headers (Helmet equivalent for Hono)
// Protects against XSS, Clickjacking, MIME-sniffing, etc.
app.use(secureHeaders());

// 3. CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3001").split(",");

app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow requests from defined origins or local development
      if (!origin || allowedOrigins.includes(origin)) {
        return origin;
      }
      return allowedOrigins[0]; // Fallback
    },
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600, // Cache preflight request for 10 minutes
    credentials: true, // Required for cookies (Auth)
  }),
);

// --- Routes ---

// 1. Better Auth Handler
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// 2. tRPC Handler
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
    onError: ({ path, error }) => {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
    },
  }),
);

// 3. Health Check
app.get("/", (c) => {
  return c.json({ status: "ok", service: "api", timestamp: new Date() });
});

// --- Error Handling ---

app.notFound((c) => {
  return c.json({ message: "Not Found", path: c.req.path }, 404);
});

app.onError((err, c) => {
  console.error("Internal Server Error:", err);
  return c.json({ message: "Internal Server Error", error: err.message }, 500);
});

// --- Server Entry Point ---

// Port 3001 prevents conflict with Next.js (usually 3000)
const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server is running on port ${port}`);

// Native Bun support (Recommended if using Bun)
export default {
  port,
  fetch: app.fetch,
};

// Node.js fallback (If not running with Bun)
if (!process.versions.bun) {
  serve({
    fetch: app.fetch,
    port,
  });
}

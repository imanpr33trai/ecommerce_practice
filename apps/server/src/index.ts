import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { createContext, type HonoEnv } from "@ecomerceNextjs/api/context";
import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { auth } from "@ecomerceNextjs/auth";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authMiddleware } from "./middlewares/auth.middleware";

const app = new Hono<HonoEnv>();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(authMiddleware);

// 1. Session Middleware: Fetch once per request

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (_opts, c) => {
      // This now matches the CreateContextOptions type above
      return createContext(c);
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

export default app;

if (!process.versions.bun) {
  const port = 3000;
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { createContext, HonoEnv } from "@ecomerceNextjs/api/context";
import { appRouter } from "@ecomerceNextjs/api/routers/index";
import { auth } from "@ecomerceNextjs/auth";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

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

// 1. Session Middleware: Fetch once per request
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ req:context.req.raw ,session:context.var.session ? {user:context.var.user!, session:context.var.session}:null});
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

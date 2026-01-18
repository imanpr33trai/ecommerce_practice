import { handle } from "hono/vercel";
import { api } from "@ecomerceNextjs/api";
import type { HonoEnv } from "@ecomerceNextjs/api/context";
import { auth } from "@ecomerceNextjs/auth";
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

export default handle(app);

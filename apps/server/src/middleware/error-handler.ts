import { HTTPException } from "hono/http-exception";
import type { MiddlewareHandler } from "hono";

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (error) {
    // In production, you might want to send this to a logging service

    if (error instanceof HTTPException) {
      return c.json(
        {
          error: error.message,
          status: error.status,
        },
        error.status,
      );
    }

    return c.json(
      {
        error: "Internal Server Error",
        status: 500,
      },
      500,
    );
  }
};

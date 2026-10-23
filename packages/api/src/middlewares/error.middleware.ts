import { AppError, ErrorCode, isAppError } from "@ecommerceNextjs/types";
import z, { ZodError } from "zod";
import type { Context } from "hono";

import type { HonoEnv } from "../context";

/**
 * Global Error Handler for Hono's onError
 * Handles AppError, ZodError, and unexpected errors
 * Returns consistent error response format: { success: false, code, message, details? }
 */
export function errorHandler(err: Error, c: Context<HonoEnv>) {
  // 1. Handle AppError (operational errors we expect)
  if (isAppError(err)) {
    return c.json(
      {
        success: false,
        code: err.code,
        message: err.message,
        details: err.details,
      },
      err.statusCode as 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503
    );
  }

  // 2. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const treeified = z.treeifyError(err);
    return c.json(
      {
        success: false,
        code: ErrorCode.VALIDATION_ERROR,
        message: "Validation failed",
        details: {
          fields: (treeified as { properties?: Record<string, unknown> }).properties ?? treeified.errors,
        },
      },
      400
    );
  }

  // 3. Handle Hono HTTPException (if any slip through)
  if (err instanceof Error && "status" in err && typeof err.status === "number") {
    const httpErr = err as Error & { status: number; message: string };
    return c.json(
      {
        success: false,
        code: ErrorCode.INTERNAL_ERROR,
        message: httpErr.message,
      },
      httpErr.status as 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503
    );
  }

  // 4. Handle unexpected errors (programmer errors, DB connection issues, etc.)
  console.error("[Unexpected Error]", err);

  return c.json(
    {
      success: false,
      code: ErrorCode.INTERNAL_ERROR,
      message: "Internal server error",
    },
    500
  );
}
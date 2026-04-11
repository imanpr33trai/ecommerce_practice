import type { Context } from "hono";

import { HTTPException } from "hono/http-exception";
import z, { ZodError } from "zod"; // Import ZodError directly

import { AppError } from "./errors.js";

export const errorHandler = (err: Error, c: Context) => {
	// 1. Handle Hono HTTPExceptions (e.g., c.error(), 401 Unauthorized)
	if (err instanceof HTTPException) {
		return err.getResponse();
	}

	// 2. Handle Zod Validation Errors (Critical for RPC Type Safety)
	if (err instanceof ZodError) {
		return c.json(
			{
				success: false,
				message: "Validation Failed",
				errors: z.treeifyError(err), // Returns structured errors for the client
			},
			400,
		);
	}

	// 3. Handle Typed App Errors
	if (err instanceof AppError) {
		return c.json(
			{
				success: false,
				message: err.message,
			},
			err.statusCode,
		);
	}

	// 4. Handle Generic Errors

	console.error(`[Internal Server Error]: ${err.message}`);

	return c.json(
		{
			success: false,
			message: err.message || "Internal Server Error",
		},
		500,
	);
};

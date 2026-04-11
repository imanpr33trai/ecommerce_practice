import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
	constructor(
		message: string,
		public readonly statusCode: ContentfulStatusCode,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(message = "Validation failed") {
		super(message, 400);
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(message, 404);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Forbidden") {
		super(message, 403);
	}
}

export class ConflictError extends AppError {
	constructor(message = "Conflict") {
		super(message, 409);
	}
}

export class InternalError extends AppError {
	constructor(message = "Internal server error") {
		super(message, 500);
	}
}

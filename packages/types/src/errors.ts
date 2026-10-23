/**
 * Unified error handling for the API
 * Provides typed error codes and consistent error responses
 */

export enum ErrorCode {
  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // Authentication
  UNAUTHENTICATED = "UNAUTHENTICATED",
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",

  // Authorization
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  // Resource
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",

  // Business logic
  OUT_OF_STOCK = "OUT_OF_STOCK",
  INVALID_OPERATION = "INVALID_OPERATION",
  PRECONDITION_FAILED = "PRECONDITION_FAILED",

  // Rate limiting
  RATE_LIMITED = "RATE_LIMITED",

  // Internal
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
}

export interface ErrorDetails {
  field?: string;
  fields?: Record<string, string[]>;
  [key: string]: unknown;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: ErrorDetails;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    options: {
      statusCode?: number;
      details?: ErrorDetails;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = options.statusCode ?? defaultStatusCode(code);
    this.details = options.details;
    this.isOperational = true;

    if (options.cause) {
      this.cause = options.cause;
    }

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  static validation(message: string, details?: ErrorDetails): AppError {
    return new AppError(ErrorCode.VALIDATION_ERROR, message, {
      statusCode: 400,
      details,
    });
  }

  static unauthorized(message = "Authentication required"): AppError {
    return new AppError(ErrorCode.UNAUTHENTICATED, message, { statusCode: 401 });
  }

  static forbidden(message = "Access denied"): AppError {
    return new AppError(ErrorCode.FORBIDDEN, message, { statusCode: 403 });
  }

  static notFound(resource: string, id?: string): AppError {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    return new AppError(ErrorCode.NOT_FOUND, message, { statusCode: 404 });
  }

  static conflict(message: string, details?: ErrorDetails): AppError {
    return new AppError(ErrorCode.CONFLICT, message, { statusCode: 409, details });
  }

  static outOfStock(productName?: string): AppError {
    const message = productName ? `Product '${productName}' is out of stock` : "Out of stock";
    return new AppError(ErrorCode.OUT_OF_STOCK, message, { statusCode: 409 });
  }

  static internal(message = "Internal server error", cause?: Error): AppError {
    return new AppError(ErrorCode.INTERNAL_ERROR, message, { statusCode: 500, cause });
  }

  static fromZodError(_zodError: unknown): AppError {
    // This will be implemented in the error middleware
    return new AppError(ErrorCode.VALIDATION_ERROR, "Validation failed", { statusCode: 400 });
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

function defaultStatusCode(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
      return 400;
    case ErrorCode.UNAUTHENTICATED:
    case ErrorCode.TOKEN_EXPIRED:
    case ErrorCode.TOKEN_INVALID:
      return 401;
    case ErrorCode.FORBIDDEN:
    case ErrorCode.INSUFFICIENT_PERMISSIONS:
      return 403;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.ALREADY_EXISTS:
    case ErrorCode.CONFLICT:
    case ErrorCode.OUT_OF_STOCK:
      return 409;
    case ErrorCode.RATE_LIMITED:
      return 429;
    case ErrorCode.INTERNAL_ERROR:
    case ErrorCode.DATABASE_ERROR:
    case ErrorCode.EXTERNAL_SERVICE_ERROR:
      return 500;
    case ErrorCode.SERVICE_UNAVAILABLE:
      return 503;
    default:
      return 500;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
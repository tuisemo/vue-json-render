/**
 * Error handling utilities for Vue JSON Render
 */

/**
 * Base error class for all custom errors
 */
export class JsonUIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'JsonUIError';
    // Note: Error.captureStackTrace is a Node.js extension to Error
    // We use a type assertion to avoid TypeScript errors
    const ErrorCtor = Error as ErrorConstructor & { captureStackTrace?(target: Error, constructor: Function): void };
    if (typeof ErrorCtor.captureStackTrace === 'function') {
      ErrorCtor.captureStackTrace(this, JsonUIError);
    }
  }
}

/**
 * Validation error - thrown when validation fails
 */
export class ValidationError extends JsonUIError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly errors?: readonly string[],
  ) {
    super(message, 'VALIDATION_ERROR', { field, errors });
    this.name = 'ValidationError';
  }
}

/**
 * Catalog error - thrown when catalog operations fail
 */
export class CatalogError extends JsonUIError {
  constructor(
    message: string,
    public readonly componentType?: string,
  ) {
    super(message, 'CATALOG_ERROR', { componentType });
    this.name = 'CatalogError';
  }
}

/**
 * Action error - thrown when action execution fails
 */
export class ActionError extends JsonUIError {
  constructor(
    message: string,
    public readonly actionName?: string,
    public readonly originalError?: Error,
  ) {
    super(message, 'ACTION_ERROR', { actionName });
    this.name = 'ActionError';
    this.cause = originalError;
  }
}

/**
 * Stream error - thrown when streaming operations fail
 */
export class StreamError extends JsonUIError {
  constructor(
    message: string,
    public readonly chunk?: string,
    public readonly originalError?: Error,
  ) {
    super(message, 'STREAM_ERROR', { chunk });
    this.name = 'StreamError';
    this.cause = originalError;
  }
}

/**
 * Render error - thrown when rendering fails
 */
export class RenderError extends JsonUIError {
  constructor(
    message: string,
    public readonly elementKey?: string,
    public readonly componentType?: string,
  ) {
    super(message, 'RENDER_ERROR', { elementKey, componentType });
    this.name = 'RenderError';
  }
}

/**
 * Type guard to check if error is a JsonUIError
 */
export function isJsonUIError(error: unknown): error is JsonUIError {
  return error instanceof JsonUIError;
}

/**
 * Type guard to check if error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is a CatalogError
 */
export function isCatalogError(error: unknown): error is CatalogError {
  return error instanceof CatalogError;
}

/**
 * Type guard to check if error is an ActionError
 */
export function isActionError(error: unknown): error is ActionError {
  return error instanceof ActionError;
}

/**
 * Type guard to check if error is a StreamError
 */
export function isStreamError(error: unknown): error is StreamError {
  return error instanceof StreamError;
}

/**
 * Type guard to check if error is a RenderError
 */
export function isRenderError(error: unknown): error is RenderError {
  return error instanceof RenderError;
}

/**
 * Convert any error to a user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (isJsonUIError(error)) {
      return error.message;
    }
    return error.message;
  }
  return String(error);
}

/**
 * Log error with appropriate level based on error type
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '';

  if (isValidationError(error)) {
    console.warn(`${prefix} Validation error:`, error.message, error.details);
  } else if (isCatalogError(error)) {
    console.error(`${prefix} Catalog error:`, error.message, error.details);
  } else if (isActionError(error)) {
    console.error(`${prefix} Action error:`, error.message, error.details, error.originalError);
  } else if (isStreamError(error)) {
    console.error(`${prefix} Stream error:`, error.message, error.details, error.originalError);
  } else if (isRenderError(error)) {
    console.error(`${prefix} Render error:`, error.message, error.details);
  } else if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message, error);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}

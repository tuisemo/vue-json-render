import { z } from 'zod';
import type { DynamicValue, DataModel, LogicExpression } from './types';
import { DynamicValueSchema, resolveDynamicValue } from './types';
import { LogicExpressionSchema, evaluateLogicExpression } from './visibility';

/**
 * Validation check definition
 */
export interface ValidationCheck {
  /** Function name (built-in or from catalog) */
  readonly fn: string;
  /** Additional arguments for function */
  readonly args?: Readonly<Record<string, DynamicValue>>;
  /** Error message to display if check fails */
  readonly message: string;
}

/**
 * Validation configuration for a field
 */
export interface ValidationConfig {
  /** Array of checks to run */
  readonly checks?: readonly ValidationCheck[];
  /** When to run validation */
  readonly validateOn?: 'change' | 'blur' | 'submit';
  /** Condition for when validation is enabled */
  readonly enabled?: LogicExpression;
}

/**
 * Schema for validation check
 */
export const ValidationCheckSchema = z.object({
  fn: z.string(),
  args: z.record(z.string(), DynamicValueSchema).optional(),
  message: z.string(),
});

/**
 * Schema for validation config
 */
export const ValidationConfigSchema = z.object({
  checks: z.array(ValidationCheckSchema).optional(),
  validateOn: z.enum(['change', 'blur', 'submit']).optional(),
  enabled: LogicExpressionSchema.optional(),
});

/**
 * Validation function signature
 */
export type ValidationFunction = (
  value: unknown,
  args?: Readonly<Record<string, unknown>>,
) => boolean;

/**
 * Built-in validation functions
 */
export const builtInValidationFunctions: Readonly<Record<string, ValidationFunction>> = {
  required: (value: unknown) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  email: (value: unknown) => {
    if (typeof value !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  minLength: (value: unknown, args) => {
    if (typeof value !== 'string') return false;
    const min = args?.['min'];
    if (typeof min !== 'number') return false;
    return value.length >= min;
  },

  maxLength: (value: unknown, args) => {
    if (typeof value !== 'string') return false;
    const max = args?.['max'];
    if (typeof max !== 'number') return false;
    return value.length <= max;
  },

  pattern: (value: unknown, args) => {
    if (typeof value !== 'string') return false;
    const pattern = args?.['pattern'];
    if (typeof pattern !== 'string') return false;
    try {
      return new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  },

  min: (value: unknown, args) => {
    if (typeof value !== 'number') return false;
    const min = args?.['min'];
    if (typeof min !== 'number') return false;
    return value >= min;
  },

  max: (value: unknown, args) => {
    if (typeof value !== 'number') return false;
    const max = args?.['max'];
    if (typeof max !== 'number') return false;
    return value <= max;
  },

  numeric: (value: unknown) => {
    if (typeof value === 'number') return !Number.isNaN(value);
    if (typeof value === 'string') return !Number.isNaN(Number.parseFloat(value));
    return false;
  },

  url: (value: unknown) => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  matches: (value: unknown, args) => {
    const other = args?.['other'];
    return value === other;
  },
} as const;

/**
 * Validation result for a single check
 */
export interface ValidationCheckResult {
  readonly fn: string;
  readonly valid: boolean;
  readonly message: string;
}

/**
 * Full validation result for a field
 */
export interface FieldValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly checks: readonly ValidationCheckResult[];
}

/**
 * Context for running validation
 */
export interface ValidationContext {
  readonly value: unknown;
  readonly dataModel: DataModel;
  readonly authState?: { isSignedIn: boolean };
  readonly customFunctions?: Readonly<Record<string, ValidationFunction>>;
}

/**
 * Run a single validation check
 */
export function runValidationCheck(
  check: ValidationCheck,
  ctx: ValidationContext,
): ValidationCheckResult {
  const { value, dataModel, customFunctions } = ctx;

  const resolvedArgs: Record<string, unknown> = {};
  if (check.args) {
    for (const [key, argValue] of Object.entries(check.args)) {
      resolvedArgs[key] = resolveDynamicValue(argValue, dataModel);
    }
  }

  const fn =
    builtInValidationFunctions[check.fn] ?? customFunctions?.[check.fn];

  if (!fn) {
    console.warn(`Unknown validation function: ${check.fn}`);
    return {
      fn: check.fn,
      valid: true,
      message: check.message,
    };
  }

  const valid = fn(value, resolvedArgs);

  return {
    fn: check.fn,
    valid,
    message: check.message,
  };
}

/**
 * Run all validation checks for a field
 */
export function runValidation(
  config: ValidationConfig,
  ctx: ValidationContext & { authState?: { isSignedIn: boolean } },
): FieldValidationResult {
  const checks: ValidationCheckResult[] = [];
  const errors: string[] = [];

  if (config.enabled) {
    const enabled = evaluateLogicExpression(config.enabled, {
      dataModel: ctx.dataModel,
      authState: ctx.authState,
    });
    if (!enabled) {
      return { valid: true, errors: [], checks: [] };
    }
  }

  if (config.checks) {
    for (const check of config.checks) {
      const result = runValidationCheck(check, ctx);
      checks.push(result);
      if (!result.valid) {
        errors.push(result.message);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    checks,
  };
}

/**
 * Helper to create validation checks
 */
export const check = {
  required: (message = 'This field is required'): ValidationCheck => ({
    fn: 'required',
    message,
  }),

  email: (message = 'Invalid email address'): ValidationCheck => ({
    fn: 'email',
    message,
  }),

  minLength: (min: number, message?: string): ValidationCheck => ({
    fn: 'minLength',
    args: { min },
    message: message ?? `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationCheck => ({
    fn: 'maxLength',
    args: { max },
    message: message ?? `Must be at most ${max} characters`,
  }),

  pattern: (pattern: string, message = 'Invalid format'): ValidationCheck => ({
    fn: 'pattern',
    args: { pattern },
    message,
  }),

  min: (min: number, message?: string): ValidationCheck => ({
    fn: 'min',
    args: { min },
    message: message ?? `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationCheck => ({
    fn: 'max',
    args: { max },
    message: message ?? `Must be at most ${max}`,
  }),

  url: (message = 'Invalid URL'): ValidationCheck => ({
    fn: 'url',
    message,
  }),

  matches: (
    otherPath: string,
    message = 'Fields must match',
  ): ValidationCheck => ({
    fn: 'matches',
    args: { other: { path: otherPath } },
    message,
  }),
};

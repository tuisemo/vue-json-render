import { z } from 'zod';

/**
 * Dynamic value - can be a literal or a path reference to data model
 */
export type DynamicValue<T = unknown> = T | { path: string };

export type DynamicString = DynamicValue<string>;
export type DynamicNumber = DynamicValue<number>;
export type DynamicBoolean = DynamicValue<boolean>;

/**
 * Zod schemas for dynamic values
 */
export const DynamicValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.object({ path: z.string() }),
]);

export const DynamicStringSchema = z.union([
  z.string(),
  z.object({ path: z.string() }),
]);

export const DynamicNumberSchema = z.union([
  z.number(),
  z.object({ path: z.string() }),
]);

export const DynamicBooleanSchema = z.union([
  z.boolean(),
  z.object({ path: z.string() }),
]);

/**
 * Base UI element structure
 */
export interface UIElement<T extends string = string, P = Record<string, unknown>> {
  /** Unique key for reconciliation */
  readonly key: string;
  /** Component type from the catalog */
  readonly type: T;
  /** Component props */
  readonly props: P;
  /** Child element keys (flat structure) */
  readonly children?: readonly string[];
  /** Parent element key (null for root) */
  readonly parentKey?: string | null;
  /** Visibility condition */
  readonly visible?: VisibilityCondition;
}

/**
 * Visibility condition types
 */
export type VisibilityCondition =
  | boolean
  | { readonly path: string }
  | { readonly auth: 'signedIn' | 'signedOut' }
  | LogicExpression;

/**
 * Logic expression for complex conditions
 */
export type LogicExpression =
  | { readonly and: readonly LogicExpression[] }
  | { readonly or: readonly LogicExpression[] }
  | { readonly not: LogicExpression }
  | { readonly path: string }
  | { readonly eq: [DynamicValue, DynamicValue] }
  | { readonly neq: [DynamicValue, DynamicValue] }
  | { readonly gt: [DynamicNumber, DynamicNumber] }
  | { readonly gte: [DynamicNumber, DynamicNumber] }
  | { readonly lt: [DynamicNumber, DynamicNumber] }
  | { readonly lte: [DynamicNumber, DynamicNumber] };

/**
 * Flat UI tree structure (optimized for LLM generation)
 */
export interface UITree {
  /** Root element key */
  readonly root: string;
  /** Flat map of elements by key */
  readonly elements: Readonly<Record<string, UIElement>>;
}

/**
 * Auth state for visibility evaluation
 */
export interface AuthState {
  readonly isSignedIn: boolean;
  readonly user?: Readonly<Record<string, unknown>>;
}

/**
 * Data model type
 */
export type DataModel = Readonly<Record<string, unknown>>;

/**
 * Component schema definition using Zod
 */
export type ComponentSchema = z.ZodType<Record<string, unknown>>;

/**
 * Validation mode for catalog validation
 */
export type ValidationMode = 'strict' | 'warn' | 'ignore';

/**
 * JSON patch operation types
 */
export type PatchOp = 'add' | 'remove' | 'replace' | 'set';

/**
 * JSON patch operation
 */
export interface JsonPatch {
  readonly op: PatchOp;
  readonly path: string;
  readonly value?: unknown;
}

/**
 * Resolve a dynamic value against a data model
 */
export function resolveDynamicValue<T>(
  value: DynamicValue<T>,
  dataModel: DataModel,
): T | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'object' && 'path' in value) {
    return getByPath(dataModel, value.path) as T | undefined;
  }

  return value as T;
}

/**
 * Get a value from an object by JSON Pointer path
 */
export function getByPath(obj: unknown, path: string): unknown {
  if (!path || path === '/') {
    return obj;
  }

  const segments = path.startsWith('/')
    ? path.slice(1).split('/')
    : path.split('/');

  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Set a value in an object by JSON Pointer path
 * Note: Mutates the object in place
 */
export function setByPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): void {
  const segments = path.startsWith('/')
    ? path.slice(1).split('/')
    : path.split('/');

  if (segments.length === 0) return;

  let current: Record<string, unknown> = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (!segment) continue;

    if (!(segment in current) || typeof current[segment] !== 'object') {
      current[segment] = {};
    }
    current = current[segment] as Record<string, unknown>;
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment) {
    current[lastSegment] = value;
  }
}

/**
 * Create a shallow clone of an object
 */
export function clone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return [...obj] as T;
  }

  return { ...obj };
}

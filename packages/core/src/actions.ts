import { z } from "zod";
import type { DynamicValue, DataModel } from "./types";
import { DynamicValueSchema, resolveDynamicValue } from "./types";

/**
 * Confirmation dialog configuration
 */
export interface ActionConfirm {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly variant?: "default" | "danger";
}

/**
 * Action success handler
 */
export type ActionOnSuccess =
  | { readonly navigate: string }
  | { readonly set: Record<string, unknown> }
  | { readonly action: string };

/**
 * Action error handler
 */
export type ActionOnError =
  | { readonly set: Record<string, unknown> }
  | { readonly action: string };

/**
 * Rich action definition
 */
export interface Action {
  /** Action name (must be in catalog) */
  readonly name: string;
  /** Parameters to pass to action handler */
  readonly params?: Readonly<Record<string, DynamicValue>>;
  /** Confirmation dialog before execution */
  readonly confirm?: ActionConfirm;
  /** Handler after successful execution */
  readonly onSuccess?: ActionOnSuccess;
  /** Handler after failed execution */
  readonly onError?: ActionOnError;
}

/**
 * Schema for action confirmation
 */
export const ActionConfirmSchema = z.object({
  title: z.string(),
  message: z.string(),
  confirmLabel: z.string().optional(),
  cancelLabel: z.string().optional(),
  variant: z.enum(["default", "danger"]).optional(),
});

/**
 * Schema for success handlers
 */
export const ActionOnSuccessSchema = z.union([
  z.object({ navigate: z.string() }),
  z.object({ set: z.record(z.string(), z.unknown()) }),
  z.object({ action: z.string() }),
]);

/**
 * Schema for error handlers
 */
export const ActionOnErrorSchema = z.union([
  z.object({ set: z.record(z.string(), z.unknown()) }),
  z.object({ action: z.string() }),
]);

/**
 * Full action schema
 */
export const ActionSchema = z.object({
  name: z.string(),
  params: z.record(z.string(), DynamicValueSchema).optional(),
  confirm: ActionConfirmSchema.optional(),
  onSuccess: ActionOnSuccessSchema.optional(),
  onError: ActionOnErrorSchema.optional(),
});

/**
 * Action handler function signature
 */
export type ActionHandler<
  TParams = Record<string, unknown>,
  TResult = unknown,
> = (params: TParams) => Promise<TResult> | TResult;

/**
 * Resolved action with all dynamic values resolved
 */
export interface ResolvedAction {
  readonly name: string;
  readonly params: Record<string, unknown>;
  readonly confirm?: ActionConfirm;
  readonly onSuccess?: ActionOnSuccess;
  readonly onError?: ActionOnError;
}

/**
 * Resolve all dynamic values in an action
 */
export function resolveAction(
  action: Action,
  dataModel: DataModel,
): ResolvedAction {
  const resolvedParams: Record<string, unknown> = {};

  if (action.params) {
    for (const [key, value] of Object.entries(action.params)) {
      resolvedParams[key] = resolveDynamicValue(value, dataModel);
    }
  }

  // Interpolate confirmation message if present
  let confirm = action.confirm;
  if (confirm) {
    confirm = {
      ...confirm,
      message: interpolateString(confirm.message, dataModel),
      title: interpolateString(confirm.title, dataModel),
    };
  }

  return {
    name: action.name,
    params: resolvedParams,
    confirm,
    onSuccess: action.onSuccess,
    onError: action.onError,
  };
}

/**
 * Interpolate ${path} expressions in a string
 */
export function interpolateString(
  template: string,
  dataModel: DataModel,
): string {
  return template.replace(/\$\{([^}]+)\}/g, (_, path) => {
    const value = resolveDynamicValue({ path }, dataModel);
    return String(value ?? "");
  });
}

/**
 * Context for action execution
 */
export interface ActionExecutionContext {
  /** The resolved action */
  readonly action: ResolvedAction;
  /** The action handler from host */
  readonly handler: ActionHandler;
  /** Function to update data model */
  readonly setData: (path: string, value: unknown) => void;
  /** Function to navigate */
  readonly navigate?: (path: string) => void;
  /** Function to execute another action */
  readonly executeAction?: (name: string) => Promise<void>;
}

/**
 * Execute an action with all callbacks
 */
export async function executeAction(
  ctx: ActionExecutionContext,
): Promise<void> {
  const { action, handler, setData, navigate, executeAction } = ctx;

  try {
    await handler(action.params);

    if (action.onSuccess) {
      if ("navigate" in action.onSuccess && navigate) {
        navigate(action.onSuccess.navigate);
      } else if ("set" in action.onSuccess) {
        for (const [path, value] of Object.entries(action.onSuccess.set)) {
          setData(path, value);
        }
      } else if ("action" in action.onSuccess && executeAction) {
        await executeAction(action.onSuccess.action);
      }
    }
  } catch (error) {
    if (action.onError) {
      if ("set" in action.onError) {
        for (const [path, value] of Object.entries(action.onError.set)) {
          const resolvedValue =
            typeof value === "string" && value === "$error.message"
              ? (error as Error).message
              : value;
          setData(path, resolvedValue);
        }
      } else if ("action" in action.onError && executeAction) {
        await executeAction(action.onError.action);
      }
    } else {
      throw error;
    }
  }
}

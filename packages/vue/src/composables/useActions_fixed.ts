import {
  inject,
  reactive,
  ref,
  computed,
  type InjectionKey,
  type Ref,
  type ComputedRef,
} from 'vue';
import {
  resolveAction,
  executeAction,
  type Action,
  type ActionHandler,
  type ResolvedAction,
  type ActionConfirm,
} from '@vue-json-render/core';
import { useData, type DataContextValue } from './useData';

/**
 * Pending confirmation state
 */
export interface PendingConfirmation {
  /** The resolved action */
  readonly action: ResolvedAction;
  /** The action handler */
  readonly handler: ActionHandler;
  /** Resolve callback */
  readonly resolve: () => void;
  /** Reject callback */
  readonly reject: () => void;
}

/**
 * Action context value
 */
export interface ActionContextValue {
  /** Registered action handlers */
  handlers: Readonly<Record<string, ActionHandler>>;
  /** Currently loading action names */
  loadingActions: Ref<Readonly<Set<string>>>;
  /** Pending confirmation dialog */
  pendingConfirmation: Ref<PendingConfirmation | null>;
  /** Execute an action */
  execute: (action: Action) => Promise<void>;
  /** Confirm the pending action */
  confirm: () => void;
  /** Cancel the pending action */
  cancel: () => void;
}

const ACTION_CONTEXT_KEY: InjectionKey<ActionContextValue> = Symbol('action-context');

/**
 * Props for ActionProvider
 */
export interface ActionProviderProps {
  /** Initial action handlers */
  handlers?: Record<string, ActionHandler>;
  /** Navigation function */
  navigate?: (path: string) => void;
}

/**
 * Provide action context
 */
export function provideActionContext({
  handlers: initialHandlers = {},
  navigate,
}: ActionProviderProps): ActionContextValue {
  const { data, set } = useData();

  const handlers = reactive<Record<string, ActionHandler>>(initialHandlers);
  const loadingActions = ref<Set<string>>(new Set());
  const pendingConfirmation = ref<PendingConfirmation | null>(null);

  const execute = async (action: Action): Promise<void> => {
    const resolved = resolveAction(action, data);
    const handler = handlers[resolved.name];

    if (!handler) {
      console.warn(`No handler registered for action: ${resolved.name}`);
      return;
    }

    if (resolved.confirm) {
      return new Promise<void>((resolve, reject) => {
        pendingConfirmation.value = {
          action: resolved,
          handler,
          resolve: () => {
            pendingConfirmation.value = null;
            resolve();
          },
          reject: () => {
            pendingConfirmation.value = null;
            reject(new Error('Action cancelled'));
          },
        };
      }).then(async () => {
        const newLoading = new Set(loadingActions.value);
        newLoading.add(resolved.name);
        loadingActions.value = newLoading;

        try {
          await executeAction({
            action: resolved,
            handler,
            setData: set,
            navigate,
            executeAction: async (name: string) => {
              const subAction: Action = { name };
              await execute(subAction);
            },
          });
        } finally {
          const newLoading = new Set(loadingActions.value);
          newLoading.delete(resolved.name);
          loadingActions.value = newLoading;
        }
      });
    }

    const newLoading = new Set(loadingActions.value);
    newLoading.add(resolved.name);
    loadingActions.value = newLoading;

    try {
      await executeAction({
        action: resolved,
        handler,
        setData: set,
        navigate,
        executeAction: async (name: string) => {
          const subAction: Action = { name };
          await execute(subAction);
        },
      });
    } finally {
      const newLoading = new Set(loadingActions.value);
      newLoading.delete(resolved.name);
      loadingActions.value = newLoading;
    }
  };

  const confirm = (): void => {
    pendingConfirmation.value?.resolve();
  };

  const cancel = (): void => {
    pendingConfirmation.value?.reject();
  };

  const context: ActionContextValue = {
    handlers,
    loadingActions,
    pendingConfirmation,
    execute,
    confirm,
    cancel,
  };

  return context;
}

/**
 * Use action context
 */
export function useActions(): Readonly<ActionContextValue> {
  const context = inject<ActionContextValue>(ACTION_CONTEXT_KEY);
  if (!context) {
    throw new Error('useActions must be used within an ActionProvider');
  }
  return context;
}

/**
 * Execute a specific action
 */
export function useAction(
  action: Action,
): {
  execute: () => Promise<void>;
  isLoading: ComputedRef<boolean>;
} {
  const { execute, loadingActions } = useActions();

  const isLoading = computed(() => loadingActions.value.has(action.name));

  const executeAction = async (): Promise<void> => {
    await execute(action);
  };

  return { execute: executeAction, isLoading };
}

export { ACTION_CONTEXT_KEY };

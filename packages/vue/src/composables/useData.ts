import {
  inject,
  computed,
  type Ref,
  type InjectionKey,
  type ComputedRef,
} from 'vue';
import { reactive, readonly } from 'vue';
import { getByPath, setByPath, type DataModel, type AuthState } from '@vue-json-render/core';

/**
 * Data context value
 */
export interface DataContextValue {
  /** The current data model */
  data: Readonly<DataModel>;
  /** Auth state for visibility evaluation */
  authState?: AuthState;
  /** Get a value by path */
  get: (path: string) => unknown;
  /** Set a value by path */
  set: (path: string, value: unknown) => void;
  /** Update multiple values at once */
  update: (updates: Record<string, unknown>) => void;
}

const DATA_CONTEXT_KEY: InjectionKey<DataContextValue> = Symbol('data-context');

/**
 * Props for DataProvider
 */
export interface DataProviderProps {
  /** Initial data model */
  initialData?: DataModel;
  /** Auth state */
  authState?: AuthState;
  /** Callback when data changes */
  onDataChange?: (path: string, value: unknown) => void;
}

/**
 * Provide data context
 */
export function provideDataContext({
  initialData = {},
  authState,
  onDataChange,
}: DataProviderProps): DataContextValue {
  const data = reactive<DataModel>(initialData);

  const get = (path: string): unknown => {
    return getByPath(data, path);
  };

  const set = (path: string, value: unknown): void => {
    setByPath(data, path, value);
    onDataChange?.(path, value);
  };

  const update = (updates: Record<string, unknown>): void => {
    for (const [path, value] of Object.entries(updates)) {
      setByPath(data, path, value);
      onDataChange?.(path, value);
    }
  };

  const context: DataContextValue = {
    data: readonly(data),
    authState,
    get,
    set,
    update,
  };

  return context;
}

/**
 * Use data context
 */
export function useData(): Readonly<DataContextValue> {
  const context = inject<DataContextValue>(DATA_CONTEXT_KEY);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

/**
 * Get a value from the data model
 */
export function useDataValue<T>(
  path: string,
): ComputedRef<T | undefined> {
  const { get } = useData();
  return computed(() => get(path) as T | undefined);
}

/**
 * Get and set a value from the data model (like ref)
 */
export function useDataBinding<T>(
  path: string,
): [ComputedRef<T | undefined>, (value: T) => void] {
  const { get, set } = useData();

  const value = computed(() => get(path) as T | undefined);

  const setValue = (newValue: T): void => {
    set(path, newValue);
  };

  return [value, setValue];
}

export { DATA_CONTEXT_KEY };

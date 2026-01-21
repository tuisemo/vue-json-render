import {
  inject,
  computed,
  type InjectionKey,
  type ComputedRef,
} from 'vue';
import { evaluateVisibility, type VisibilityCondition, type AuthState } from '@vue-json-render/core';
import { useData, type DataContextValue } from './useData';

const VISIBILITY_CONTEXT_KEY: InjectionKey<unknown> = Symbol('visibility-context');

/**
 * Provide visibility context
 */
export function provideVisibilityContext(): void {
  // Visibility doesn't need additional state
  // It just consumes data context
}

/**
 * Use visibility context
 */
export function useVisibility(): {
  isVisible: (condition?: VisibilityCondition) => boolean;
} {
  const { data, authState } = useData();

  const isVisible = (condition?: VisibilityCondition): boolean => {
    return evaluateVisibility(condition, {
      dataModel: data,
      authState,
    });
  };

  return { isVisible };
}

/**
 * Computed visibility check for a specific condition
 */
export function useIsVisible(
  condition?: VisibilityCondition,
): ComputedRef<boolean> {
  const { data, authState } = useData();

  return computed(() =>
    evaluateVisibility(condition, {
      dataModel: data,
      authState,
    }),
  );
}

export { VISIBILITY_CONTEXT_KEY };

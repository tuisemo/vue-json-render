import { defineComponent, h, type PropType, type SlotsType, provide } from 'vue';
import {
  provideDataContext,
  type DataProviderProps,
  DATA_CONTEXT_KEY,
} from '../composables/useData';
import {
  provideVisibilityContext,
  VISIBILITY_CONTEXT_KEY,
} from '../composables/useVisibility';
import {
  provideActionContext,
  type ActionProviderProps,
  ACTION_CONTEXT_KEY,
} from '../composables/useActions';
import { provideDesignSystem } from '@vue-json-render/design-system';

/**
 * JsonUIProvider - Main provider component
 */
export const JsonUIProvider = defineComponent({
  name: 'JsonUIProvider',
  props: {
    /** Component registry (mapping component names to Vue components) */
    registry: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    /** Initial data model */
    initialData: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    /** Auth state */
    authState: {
      type: Object as PropType<{ isSignedIn: boolean; user?: Record<string, unknown> } | undefined>,
      default: undefined,
    },
    /** Action handlers */
    actionHandlers: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    /** Validation functions */
    validationFunctions: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    /** Navigation function */
    navigate: {
      type: Function as PropType<(path: string) => void>,
      default: undefined,
    },
    /** Called when data changes */
    onDataChange: {
      type: Function as PropType<(path: string, value: unknown) => void>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    // Provide design system context first (needed by useAurora, useGlass)
    provideDesignSystem({
      theme: 'aurora',
      animations: true,
      glassmorphism: true,
      particleEffects: true,
    });

    // Provide data context
    const dataContext = provideDataContext({
      initialData: props.initialData,
      authState: props.authState,
      onDataChange: props.onDataChange,
    });
    provide(DATA_CONTEXT_KEY, dataContext);

    // Provide visibility context
    provideVisibilityContext();
    provide(VISIBILITY_CONTEXT_KEY, true);

    // Provide action context (pass dataContext to avoid dependency issues)
    const actionContext = provideActionContext({
      handlers: props.actionHandlers,
      navigate: props.navigate,
      dataContext,
    });
    provide(ACTION_CONTEXT_KEY, actionContext);

    // Expose registry through injection
    const REGISTRY_KEY = Symbol('registry');
    provide(REGISTRY_KEY, props.registry);

    return () => slots['default']?.();
  },
});

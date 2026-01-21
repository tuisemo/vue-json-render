<template>
  <div
    v-if="tree?.root"
    class="json-ui-renderer"
    :class="{ 'json-ui-renderer--loading': loading }"
  >
    <UIElementRenderer
      v-if="rootElement"
      :element="rootElement"
      :tree="tree"
      :registry="registry"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  provide,
  type InjectionKey,
  type PropType,
  h,
  type VNode,
} from 'vue';
import type { UITree, UIElement } from '@vue-json-render/core';
import { useVisibility } from '../composables/useVisibility';
import { useActions, ACTION_CONTEXT_KEY } from '../composables/useActions';

interface Props {
  /** The UI tree to render */
  tree: Readonly<UITree> | null;
  /** Component registry (component name -> Vue component) */
  registry: Record<string, any>;
  /** Show loading state */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { isVisible } = useVisibility();
const { execute, loadingActions } = useActions();

const rootElement = computed(() => {
  if (!props.tree?.root) return null;
  return props.tree.elements[props.tree.root] as UIElement;
});

// Provide renderer context for child components
const RENDERER_CONTEXT_KEY: InjectionKey<{
  tree: Readonly<UITree>;
  registry: Record<string, any>;
  loading: boolean;
}> = Symbol('renderer-context');

provide(RENDERER_CONTEXT_KEY, {
  get tree() {
    return props.tree;
  },
  get registry() {
    return props.registry;
  },
  get loading() {
    return props.loading;
  },
});
</script>

<script lang="ts">
import { defineComponent, inject, computed, type PropType } from 'vue';

export const UIElementRenderer = defineComponent({
  name: 'UIElementRenderer',
  props: {
    element: {
      type: Object as PropType<UIElement>,
      required: true,
    },
    tree: {
      type: Object as PropType<Readonly<UITree>>,
      required: true,
    },
    registry: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    loading: Boolean,
  },
  setup(props) {
    const rendererContext = inject<{
      tree: Readonly<UITree>;
      registry: Record<string, any>;
      loading: boolean;
    }>(Symbol('renderer-context'));

    const { isVisible } = useVisibility();
    const { execute, loadingActions } = useActions();

    const visible = computed(() => {
      return isVisible(props.element.visible);
    });

    const Component = computed(() => {
      return props.registry[props.element.type];
    });

    const isLoading = computed(() => {
      return props.loading || loadingActions.value.has(props.element.type);
    });

    const childrenElements = computed(() => {
      if (!props.element.children) return [];
      return props.element.children
        .map((key: string) => props.tree.elements[key] as UIElement)
        .filter(Boolean);
    });

    return () => {
      if (!visible.value) return null;

      const component = Component.value;
      if (!component) {
        console.warn(`No renderer for: ${props.element.type}`);
        return null;
      }

      const children = childrenElements.value.map((child: UIElement) =>
        h(UIElementRenderer, {
          key: child.key,
          element: child,
          tree: props.tree,
          registry: props.registry,
          loading: props.loading,
        }),
      );

      return h(
        component,
        {
          element: props.element,
          onAction: execute,
          loading: isLoading.value,
        },
        children.length > 0 ? children : undefined,
      );
    };
  },
});
</script>

<style scoped>
.json-ui-renderer {
  min-height: 100%;
}

.json-ui-renderer--loading {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}
</style>

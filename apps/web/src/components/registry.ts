import {
  h,
  computed,
  defineComponent,
  type PropType,
} from 'vue';
import {
  GlassCard,
  GlassButton,
  AuroraText,
  useGlass,
  useAurora,
  useDataBinding,
  useAction,
  useData,
} from '@vue-json-render/vue';
import type { UIElement } from '@vue-json-render/core';

/**
 * Component Registry
 * Maps component types from catalog to Vue components
 */
export const componentRegistry = {
  // Layout Components
  GlassCard: defineComponent({
    name: 'GlassCard',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props, { slots }) {
      const title = props.element.props.title as string | undefined;
      const description = props.element.props.description as string | undefined;

      return () =>
        h(
          GlassCard,
          {
            size: props.element.props.size || 'md',
            animated: true,
          },
          () => [
            title &&
              h(AuroraText, { size: 'lg', weight: 'semibold' }, () => title),
            description && h('p', { class: 'text-glass-muted mt-2' }, description),
            slots.default?.(),
          ],
        );
    },
  }),

  Stack: defineComponent({
    name: 'Stack',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props, { slots }) {
      const direction = computed(() => props.element.props.direction || 'vertical');
      const gap = computed(() => props.element.props.gap || 'md');
      const align = computed(() => props.element.props.align || 'start');

      const stackStyle = computed(() => ({
        display: 'flex',
        flexDirection: direction.value === 'horizontal' ? 'row' : 'column',
        gap: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        }[gap.value as string],
        alignItems: {
          start: 'flex-start',
          center: 'center',
          end: 'flex-end',
          stretch: 'stretch',
        }[align.value as string],
      }));

      return () => h('div', { style: stackStyle.value }, slots.default?.());
    },
  }),

  Grid: defineComponent({
    name: 'Grid',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props, { slots }) {
      const columns = computed(() => props.element.props.columns || 2);
      const gap = computed(() => props.element.props.gap || 'md');

      const gridStyle = computed(() => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.value}, 1fr)`,
        gap: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
        }[gap.value as string],
      }));

      return () => h('div', { style: gridStyle.value }, slots.default?.());
    },
  }),

  // Typography
  AuroraText: defineComponent({
    name: 'AuroraText',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const content = computed(() => props.element.props.content as string);

      return () =>
        h(
          AuroraText,
          {
            size: props.element.props.size || 'md',
            weight: props.element.props.weight || 'semibold',
            animated: props.element.props.animated !== false,
          },
          () => content.value,
        );
    },
  }),

  // Interactive Components
  GlassButton: defineComponent({
    name: 'GlassButton',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
      onAction: {
        type: Function as PropType<(action: { name: string }) => void>,
      },
    },
    setup(props) {
      const { execute, isLoading } = useAction({
        name: props.element.props.action as string,
      });

      const handleClick = () => {
        if (props.onAction) {
          props.onAction({ name: props.element.props.action as string });
        }
      };

      return () =>
        h(
          GlassButton,
          {
            variant: props.element.props.variant || 'primary',
            size: props.element.props.size || 'md',
            loading: isLoading.value,
            onClick: handleClick,
          },
          () => props.element.props.label,
        );
    },
  }),

  GlassInput: defineComponent({
    name: 'GlassInput',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const [value, setValue] = useDataBinding(
        `/form/${props.element.props.name}`,
      );

      return () =>
        h('div', { class: 'glass-input-wrapper' }, [
          props.element.props.label &&
            h('label', { class: 'glass-label' }, props.element.props.label),
          h('input', {
            class: 'glass-input-field',
            type: props.element.props.type || 'text',
            value: value.value ?? '',
            onInput: (e: Event) =>
              setValue((e.target as HTMLInputElement).value),
            placeholder: props.element.props.placeholder || '',
          }),
        ]);
    },
  }),

  GlassTextarea: defineComponent({
    name: 'GlassTextarea',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const [value, setValue] = useDataBinding(
        `/form/${props.element.props.name}`,
      );

      return () =>
        h('div', { class: 'glass-input-wrapper' }, [
          props.element.props.label &&
            h('label', { class: 'glass-label' }, props.element.props.label),
          h('textarea', {
            class: 'glass-input-field',
            value: value.value ?? '',
            onInput: (e: Event) =>
              setValue((e.target as HTMLTextAreaElement).value),
            placeholder: props.element.props.placeholder || '',
            rows: props.element.props.rows || 3,
          }),
        ]);
    },
  }),

  // Display Components
  Metric: defineComponent({
    name: 'Metric',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const value = useData().useDataValue(props.element.props.valuePath as string);

      const formattedValue = computed(() => {
        const format = props.element.props.format || 'number';
        const val = value.value as number | undefined;

        if (val === undefined || val === null) return '--';

        switch (format) {
          case 'currency':
          case 'usd':
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(val);
          case 'percent':
            return new Intl.NumberFormat('en-US', {
              style: 'percent',
            }).format(val);
          default:
            return new Intl.NumberFormat('en-US').format(val);
        }
      });

      return () =>
        h('div', { class: 'metric' }, [
          h('div', { class: 'metric__label' }, props.element.props.label),
          h(AuroraText, { size: '3xl', weight: 'bold' }, () =>
            formattedValue.value,
          ),
          props.element.props.trend &&
            h(
              'div',
              {
                class: [
                  'metric__trend',
                  `metric__trend--${props.element.props.trend}`,
                ],
              },
              props.element.props.trendValue,
            ),
        ]);
    },
  }),

  ProgressBar: defineComponent({
    name: 'ProgressBar',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const { auroraColor } = useAurora();

      const progressStyle = computed(() => ({
        width: `${props.element.props.value}%`,
        background: auroraColor(props.element.props.color || 'purple').value,
        'box-shadow': `0 0 20px ${auroraColor(props.element.props.color || 'purple').value}66`,
      }));

      return () =>
        h('div', { class: 'progress-bar' }, [
          props.element.props.label &&
            h('div', { class: 'progress-bar__label' }, props.element.props.label),
          h('div', { class: 'progress-bar__track' }, [
            h('div', { class: 'progress-bar__fill', style: progressStyle.value }),
          ]),
        ]);
    },
  }),

  Badge: defineComponent({
    name: 'Badge',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const { auroraColor } = useAurora();

      const variant = props.element.props.variant as string || 'default';
      const badgeColor = variant === 'success'
        ? 'green'
        : variant === 'warning'
          ? '#f59e0b'
          : variant === 'danger'
            ? '#ef4444'
            : variant === 'info'
              ? 'cyan'
              : 'purple';

      const badgeStyle = computed(() => ({
        background: `rgba(${hexToRgb(auroraColor(badgeColor).value)}, 0.2)`,
        color: auroraColor(badgeColor).value,
        ...(props.element.props.glow && {
          'box-shadow': `0 0 20px ${auroraColor(badgeColor).value}66`,
        }),
      }));

      return () =>
        h('span', { class: 'badge', style: badgeStyle.value }, props.element.props.text);
    },
  }),

  Alert: defineComponent({
    name: 'Alert',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      const { auroraColor } = useAurora();

      const type = props.element.props.type as string || 'info';
      const alertColor = type === 'success'
        ? 'green'
        : type === 'warning'
          ? '#f59e0b'
          : type === 'error'
            ? '#ef4444'
            : 'blue';

      const alertStyle = computed(() => ({
        borderColor: auroraColor(alertColor).value,
        backgroundColor: `rgba(${hexToRgb(auroraColor(alertColor).value)}, 0.1)`,
      }));

      return () =>
        h('div', { class: 'alert', style: alertStyle.value }, [
          h('div', { class: 'alert__content' }, [
            h('div', { class: 'alert__title' }, props.element.props.title),
            props.element.props.message &&
              h('div', { class: 'alert__message' }, props.element.props.message),
          ]),
          props.element.props.dismissible &&
            h('button', { class: 'alert__close', onClick: () => {} }, '×'),
        ]);
    },
  }),

  Divider: defineComponent({
    name: 'Divider',
    props: {
      element: {
        type: Object as PropType<UIElement>,
        required: true,
      },
    },
    setup(props) {
      return () =>
        h('div', { class: 'divider' }, [
          h('div', { class: 'divider__line' }),
          props.element.props.label &&
            h('span', { class: 'divider__label' }, props.element.props.label),
          h('div', { class: 'divider__line' }),
        ]);
    },
  }),
};

/**
 * Helper: Convert hex to rgb
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}

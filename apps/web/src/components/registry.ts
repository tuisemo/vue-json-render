import {
  h,
  computed,
  defineComponent,
  type PropType,
} from 'vue';
import AuroraText from '@vue-json-render/design-system/components/AuroraText.vue';
import {
  // Note: Vue SFC components need to be imported directly from their files
  // because they cannot be bundled by tsup
  // import GlassCard from '@vue-json-render/vue/components/GlassCard.vue';
  // import GlassButton from '@vue-json-render/vue/components/GlassButton.vue';
  useGlass,
  useAurora,
  useDataBinding,
  useDataValue,
  useAction,
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
      const { getGlassStyle } = useGlass();
      const title = props.element.props.title as string | undefined;
      const description = props.element.props.description as string | undefined;

      return () =>
        h(
          'div',
          {
            class: 'glass-card',
            style: getGlassStyle('card'),
          },
          [
            title &&
              h('h3', { class: 'glass-card__title' }, title),
            description && h('p', { class: 'glass-card__description' }, description),
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
      const { auroraColor } = useAurora();
      const content = computed(() => props.element.props.content as string);

      const sizeClass = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
      }[props.element.props.size as string] || 'text-base';

      const weightClass = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      }[props.element.props.weight as string] || 'font-semibold';

      const textStyle = computed(() => ({
        ...(props.element.props.animated !== false && {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          background: `linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%)`,
        }),
      }));

      return () =>
        h(
          'span',
          {
            class: ['aurora-text', sizeClass, weightClass],
            style: textStyle.value,
          },
          content.value,
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
          const actionName = props.element.props.action as string;
          props.onAction({ name: actionName });
        } else {
          // Fallback: execute directly
          execute();
        }
      };

      const { getGlassStyle } = useGlass();

      const buttonStyle = computed(() => ({
        ...getGlassStyle('button'),
        opacity: isLoading.value ? 0.6 : 1,
        cursor: isLoading.value ? 'not-allowed' : 'pointer',
      }));

      return () =>
        h(
          'button',
          {
            class: 'glass-button',
            style: buttonStyle.value,
            onClick: handleClick,
            disabled: isLoading.value,
          },
          isLoading.value ? 'Loading...' : (props.element.props.label as string),
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
      const value = useDataValue<number>(props.element.props.valuePath as string);

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

      const badgeStyle = computed(() => {
        const isHex = badgeColor.startsWith('#');
        const colorValue = isHex ? badgeColor : auroraColor(badgeColor as any).value;

        return {
          background: `rgba(${hexToRgb(colorValue)}, 0.2)`,
          color: colorValue,
          ...(props.element.props.glow && {
            'box-shadow': `0 0 20px ${colorValue}66`,
          }),
        };
      });

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

      const alertStyle = computed(() => {
        const isHex = alertColor.startsWith('#');
        const colorValue = isHex ? alertColor : auroraColor(alertColor as any).value;

        return {
          borderColor: colorValue,
          backgroundColor: `rgba(${hexToRgb(colorValue)}, 0.1)`,
        };
      });

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

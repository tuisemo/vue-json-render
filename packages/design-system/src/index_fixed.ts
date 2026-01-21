// Types
export type {
  ColorVariant,
  AuroraColor,
  GlassVariant,
  AnimationType,
  AnimationDelay,
  GlowStrength,
  DesignSystemConfig,
} from './types';

export { defaultDesignConfig } from './types';

// Composables
export {
  provideDesignSystem,
  useDesignSystem,
} from './composables/useDesignSystem';

export {
  useAurora,
} from './composables/useAurora';

export {
  useGlass,
} from './composables/useGlass';

// Note: Vue components are exported directly as .vue files
// They can be imported as:
// import { AuroraText } from '@vue-json-render/design-system/components/AuroraText.vue';

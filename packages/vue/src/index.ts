// Composables
export {
  provideDataContext,
  useData,
  useDataValue,
  useDataBinding,
  DATA_CONTEXT_KEY,
} from './composables/useData';

export {
  provideVisibilityContext,
  useVisibility,
  useIsVisible,
  VISIBILITY_CONTEXT_KEY,
} from './composables/useVisibility';

export {
  provideActionContext,
  useActions,
  useAction,
  ACTION_CONTEXT_KEY,
} from './composables/useActions';

export {
  useUIStream,
  type UseUIStreamOptions,
  type UseUIStreamReturn,
} from './composables/useUIStream';

// Providers
export { JsonUIProvider } from './providers';

// Components
export { default as Renderer } from './components/Renderer.vue';
export { default as ConfirmDialog } from './components/ConfirmDialog.vue';

// Re-export core types
export type {
  DynamicValue,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  UIElement,
  UITree,
  VisibilityCondition,
  LogicExpression,
  AuthState,
  DataModel,
  PatchOp,
  JsonPatch,
} from '@vue-json-render/core';

export type {
  ComponentDefinition,
  ActionDefinition,
  CatalogConfig,
  Catalog,
  ValidationResult,
} from '@vue-json-render/core';

export type {
  ActionConfirm,
  ActionOnSuccess,
  ActionOnError,
  Action,
  ActionHandler,
  ResolvedAction,
  ActionExecutionContext,
} from '@vue-json-render/core';

export type {
  ValidationCheck,
  ValidationConfig,
  ValidationFunction,
  ValidationContext,
  ValidationCheckResult,
  ValidationResult as ValidationFullResult,
} from '@vue-json-render/core';

// Core functions
export {
  resolveDynamicValue,
  getByPath,
  setByPath,
  clone,
} from '@vue-json-render/core';

export {
  createCatalog,
  generateCatalogPrompt,
  type InferCatalogComponentProps,
} from '@vue-json-render/core';

export {
  evaluateVisibility,
  evaluateLogicExpression,
  visibility,
} from '@vue-json-render/core';

export {
  resolveAction,
  executeAction,
  interpolateString,
} from '@vue-json-render/core';

export {
  builtInValidationFunctions,
  runValidationCheck,
  runValidation,
  check,
} from '@vue-json-render/core';

// Design System
export {
  AuroraText,
  GlassCard,
  GlassButton,
  provideDesignSystem,
  useDesignSystem,
  useAurora,
  useGlass,
} from '@vue-json-render/design-system';

export type {
  ColorVariant,
  AuroraColor,
  GlassVariant,
  AnimationType,
  AnimationDelay,
  GlowStrength,
  DesignSystemConfig,
} from '@vue-json-render/design-system';

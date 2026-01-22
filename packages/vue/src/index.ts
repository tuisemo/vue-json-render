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

// Note: Vue components (Renderer, ConfirmDialog) need to be imported directly from their files
// They cannot be bundled by tsup because they require Vue SFC loader
// Import them like this:
// import Renderer from '@vue-json-render/vue/components/Renderer.vue';
// import ConfirmDialog from '@vue-json-render/vue/components/ConfirmDialog.vue';

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
  ComponentSchema,
  ValidationMode,
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

// Error handling utilities
export {
  JsonUIError,
  ValidationError,
  CatalogError,
  ActionError,
  StreamError,
  RenderError,
  isJsonUIError,
  isValidationError,
  isCatalogError,
  isActionError,
  getErrorMessage,
  logError as coreLogError,
} from '@vue-json-render/core';

// Logging utilities
export {
  setLogger,
  getLogger,
  createLogger,
  logDebug,
  logInfo,
  logWarn,
  logError,
  createScopedLogger,
} from '@vue-json-render/core';

// Design System
export {
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

// Note: Design system Vue components (AuroraText, GlassCard, GlassButton) need to be
// imported directly from '@vue-json-render/design-system/components/...'

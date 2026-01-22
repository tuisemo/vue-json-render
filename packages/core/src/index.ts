export {
  type DynamicValue,
  type DynamicString,
  type DynamicNumber,
  type DynamicBoolean,
  type UIElement,
  type UITree,
  type VisibilityCondition,
  type LogicExpression,
  type AuthState,
  type DataModel,
  type ComponentSchema,
  type ValidationMode,
  type PatchOp,
  type JsonPatch,
  resolveDynamicValue,
  getByPath,
  setByPath,
  clone,
} from './types';

// Error handling
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
  logError,
} from './errors';

// Logging
export {
  type LogLevel,
  type Logger,
  type LoggerOptions,
  setLogger,
  getLogger,
  createLogger,
  logDebug,
  logInfo,
  logWarn,
  logError2 as logLoggerError,
  createScopedLogger,
} from './logger';

export {
  DynamicValueSchema,
  DynamicStringSchema,
  DynamicNumberSchema,
  DynamicBooleanSchema,
} from './types';

export {
  type ComponentDefinition,
  type ActionDefinition,
  type CatalogConfig,
  type Catalog,
  type ValidationResult,
  createCatalog,
  generateCatalogPrompt,
  type InferCatalogComponentProps,
} from './catalog';

export {
  VisibilityConditionSchema,
  LogicExpressionSchema,
  type VisibilityContext,
  evaluateVisibility,
  evaluateLogicExpression,
  visibility,
} from './visibility';

export {
  ActionConfirmSchema,
  ActionOnSuccessSchema,
  ActionOnErrorSchema,
  ActionSchema,
  type ActionConfirm,
  type ActionOnSuccess,
  type ActionOnError,
  type Action,
  type ActionHandler,
  type ResolvedAction,
  type ActionExecutionContext,
  resolveAction,
  executeAction,
  interpolateString,
} from './actions';

export {
  ValidationCheckSchema,
  ValidationConfigSchema,
  type ValidationCheck,
  type ValidationConfig,
  type ValidationFunction,
  type ValidationContext,
  type ValidationCheckResult,
  type FieldValidationResult,
  builtInValidationFunctions,
  runValidationCheck,
  runValidation,
  check,
} from './validation';

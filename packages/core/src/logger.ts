/**
 * Logging utilities for Vue JSON Render
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  /** Enable/disable logging */
  enabled?: boolean;
  /** Minimum log level */
  level?: LogLevel;
  /** Prefix for all log messages */
  prefix?: string;
  /** Custom console implementation */
  console?: Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  createScoped(prefix: string): Logger;
}

/**
 * Logger implementation
 */
class DefaultLogger implements Logger {
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(private options: LoggerOptions) {}

  private shouldLog(level: LogLevel): boolean {
    const enabled = this.options.enabled ?? true;
    if (!enabled) return false;

    const minLevel = this.options.level ?? 'info';
    return this.levelPriority[level] >= this.levelPriority[minLevel];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.options.prefix ? `[${this.options.prefix}]` : '';
    return `${timestamp} ${prefix} [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      const console = this.options.console || window.console;
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      const console = this.options.console || window.console;
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      const console = this.options.console || window.console;
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      const console = this.options.console || window.console;
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  createScoped(prefix: string): Logger {
    const newPrefix = this.options.prefix
      ? `${this.options.prefix}:${prefix}`
      : prefix;
    return new DefaultLogger({ ...this.options, prefix: newPrefix });
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger = new DefaultLogger({
  enabled: true, // Always enabled, consumers can disable via options
  level: 'info',
  prefix: 'vue-json-render',
});

/**
 * Set the global logger
 */
export function setLogger(logger: Logger): void {
  globalLogger = logger;
}

/**
 * Get the global logger
 */
export function getLogger(): Logger {
  return globalLogger;
}

/**
 * Create a new logger instance
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  return new DefaultLogger(options);
}

/**
 * Log a debug message
 */
export function logDebug(message: string, ...args: unknown[]): void {
  globalLogger.debug(message, ...args);
}

/**
 * Log an info message
 */
export function logInfo(message: string, ...args: unknown[]): void {
  globalLogger.info(message, ...args);
}

/**
 * Log a warning
 */
export function logWarn(message: string, ...args: unknown[]): void {
  globalLogger.warn(message, ...args);
}

/**
 * Log an error
 */
export function logError2(message: string, ...args: unknown[]): void {
  globalLogger.error(message, ...args);
}

/**
 * Create a scoped logger for a specific module
 */
export function createScopedLogger(prefix: string): Logger {
  return globalLogger.createScoped(prefix);
}

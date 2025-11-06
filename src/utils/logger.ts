/**
 * Environment-aware logger utility
 *
 * Provides conditional logging based on the environment:
 * - Development: All logs are printed to console
 * - Production: Only errors are logged (console.log is suppressed)
 *
 * Usage:
 * ```typescript
 * import { logger } from './utils/logger';
 *
 * logger.log('Debug message'); // Only in development
 * logger.info('Info message'); // Only in development
 * logger.warn('Warning message'); // Only in development
 * logger.error('Error message'); // Always logged
 * ```
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Check if the application is running in development mode
 */
const isDevelopment = (): boolean => {
  // Vite/Tauri uses import.meta.env.DEV
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV === true;
  }

  // Fallback: check NODE_ENV (with type guard for environments that have process)
  try {
    // @ts-ignore - process may not be available in all environments
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env.NODE_ENV === 'development';
    }
  } catch {
    // process not available, continue to default
  }

  // Default to production (safer)
  return false;
};

/**
 * Create a conditional logger function
 */
const createLoggerMethod = (level: LogLevel) => {
  return (...args: unknown[]): void => {
    // Always allow errors through
    if (level === 'error') {
      console.error(...args);
      return;
    }

    // Only log other levels in development
    if (isDevelopment()) {
      console[level](...args);
    }
  };
};

/**
 * Conditional logger instance
 *
 * Automatically suppresses log/info/warn in production
 * Always allows error messages through
 */
export const logger: Logger = {
  log: createLoggerMethod('log'),
  info: createLoggerMethod('info'),
  warn: createLoggerMethod('warn'),
  error: createLoggerMethod('error'),
};

/**
 * Development-only logger group
 * Useful for organizing related log messages
 */
export const logGroup = {
  start: (label: string): void => {
    if (isDevelopment() && console.group) {
      console.group(label);
    }
  },
  end: (): void => {
    if (isDevelopment() && console.groupEnd) {
      console.groupEnd();
    }
  },
};

/**
 * Performance logging utility
 * Measures execution time of operations (development only)
 */
export const logPerformance = {
  start: (label: string): void => {
    if (isDevelopment() && console.time) {
      console.time(label);
    }
  },
  end: (label: string): void => {
    if (isDevelopment() && console.timeEnd) {
      console.timeEnd(label);
    }
  },
};

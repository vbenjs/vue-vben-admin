import { isString } from './types';

class VbenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VbenError';
  }
}

function throwError(scope: string, message: string): never {
  throw new VbenError(`[${scope}] ${message}`);
}

function loggerWarning(err: Error): void;
function loggerWarning(scope: string, message: string): void;
function loggerWarning(scope: string | Error, message?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const error: Error = isString(scope) ? new VbenError(`[${scope}] ${message}`) : scope;
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}

export { loggerWarning, throwError };

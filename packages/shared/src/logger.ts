class VbenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VbenAdminError';
  }
}

function loggerError(message: string) {
  throw new VbenError(`${message}`);
}

function loggerWarning(message?: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[VbenAdmin] ${message}`);
}

export { loggerError, loggerWarning };

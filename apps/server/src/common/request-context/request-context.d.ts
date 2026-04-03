import type { AppRequestContext } from './request-context.types';

declare module 'express-serve-static-core' {
  interface Request {
    requestContext?: AppRequestContext;
  }
}

export {};

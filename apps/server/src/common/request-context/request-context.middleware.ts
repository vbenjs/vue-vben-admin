import type { NextFunction, Request, Response } from 'express';

import type { AppRequestContext } from './request-context.types';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { parseRequestContext } from './request-context.util';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: RequestWithContext, _response: Response, next: NextFunction) {
    request.requestContext = parseRequestContext(request);
    next();
  }
}

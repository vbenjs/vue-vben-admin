import type { Request } from 'express';

import type { AppRequestContext } from './request-context.types';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { parseRequestContext } from './request-context.util';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

export const RequestContext = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithContext>();
  return request.requestContext || parseRequestContext(request);
});

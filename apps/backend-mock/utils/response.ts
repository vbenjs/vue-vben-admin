import type { EventHandlerRequest, H3Event } from 'h3';

export function useResponseSuccess<T = any>(data: T) {
  return {
    code: 0,
    data,
    error: null,
    message: 'ok',
  };
}

export function useResponseError(message: string, error: any = null) {
  return {
    code: -1,
    data: null,
    error,
    message,
  };
}

export function forbiddenResponse(event: H3Event<EventHandlerRequest>) {
  setResponseStatus(event, 403);
  return useResponseError('ForbiddenException', 'Forbidden Exception');
}

export function unAuthorizedResponse(event: H3Event<EventHandlerRequest>) {
  setResponseStatus(event, 401);
  return useResponseError('UnauthorizedException', 'Unauthorized Exception');
}

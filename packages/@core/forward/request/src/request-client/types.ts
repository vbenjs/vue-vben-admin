import type { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

interface MakeAuthorization {
  handler: () => null | string;
  key?: string;
}

type MakeAuthorizationFn = (
  config?: InternalAxiosRequestConfig,
) => MakeAuthorization;

interface RequestClientOptions extends CreateAxiosDefaults {
  /**
   * 用于生成Authorization
   */
  makeAuthorization?: MakeAuthorizationFn;
}
export type { MakeAuthorizationFn, RequestClientOptions, RequestContentType };

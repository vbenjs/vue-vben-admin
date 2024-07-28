import type { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

interface MakeAuthorization {
  key?: string;
  tokenHandler: () => { refreshToken: string; token: string } | null;
  unAuthorizedHandler?: () => Promise<void>;
}

interface MakeRequestHeaders {
  'Accept-Language'?: string;
}

type MakeAuthorizationFn = (
  config?: InternalAxiosRequestConfig,
) => MakeAuthorization;

type MakeRequestHeadersFn = (
  config?: InternalAxiosRequestConfig,
) => MakeRequestHeaders;

type MakeErrorMessageFn = (message: string) => void;

interface RequestClientOptions extends CreateAxiosDefaults {
  /**
   * 用于生成Authorization
   */
  makeAuthorization?: MakeAuthorizationFn;
  /**
   * 用于生成错误消息
   */
  makeErrorMessage?: MakeErrorMessageFn;

  /**
   * 用于生成请求头
   */
  makeRequestHeaders?: MakeRequestHeadersFn;
}

interface HttpResponse<T = any> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}

export type {
  HttpResponse,
  MakeAuthorizationFn,
  MakeErrorMessageFn,
  MakeRequestHeadersFn,
  RequestClientOptions,
  RequestContentType,
};

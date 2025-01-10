import type {
  AxiosError,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type RequestResponse<T = unknown> = AxiosResponse<T>;

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults;

interface HttpResponse<T = unknown> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}

type HttpResponseData<T> = T extends HttpResponse<infer U> ? U : never;

interface HttpErrorResponse {
  code: number;
  message: string;
  error: string;
}

type MakeErrorMessageFn = (
  message: string,
  error: AxiosError<HttpErrorResponse>,
) => void;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: InternalAxiosRequestConfig,
  ) =>
    | InternalAxiosRequestConfig<unknown>
    | Promise<InternalAxiosRequestConfig<unknown>>;
  rejected?: (error: unknown) => unknown;
}

interface ResponseInterceptorConfig<T = HttpResponse> {
  fulfilled?: (response: AxiosResponse<T>) => HttpResponseData<T> | T;
  rejected?: (
    error: AxiosError<HttpErrorResponse>,
  ) => AxiosError | Promise<AxiosError>;
}

export type {
  HttpResponse,
  HttpResponseData,
  MakeErrorMessageFn,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
};

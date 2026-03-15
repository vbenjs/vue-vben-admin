import type { AxiosInstance, AxiosResponse } from 'axios';

import type {
  RequestClientOptions,
  RequestClientReturnConfig,
  RequestReturnValue,
  ResponseReturnMode,
} from './types';

import { bindMethods, isString, merge } from '@vben/utils';

import axios from 'axios';
import qs from 'qs';

import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { SSE } from './modules/sse';
import { FileUploader } from './modules/uploader';

type EffectiveReturnMode<
  TOverride extends ResponseReturnMode | undefined,
  TDefault extends ResponseReturnMode,
> = [TOverride] extends [undefined] ? TDefault : Exclude<TOverride, undefined>;

function getParamsSerializer(
  paramsSerializer: RequestClientOptions['paramsSerializer'],
) {
  if (isString(paramsSerializer)) {
    switch (paramsSerializer) {
      case 'brackets': {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'brackets' });
      }
      case 'comma': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'comma' });
      }
      case 'indices': {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'indices' });
      }
      case 'repeat': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'repeat' });
      }
    }
  }
  return paramsSerializer;
}

class RequestClient<TDefaultReturn extends ResponseReturnMode = 'raw'> {
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];

  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  public download: FileDownloader['download'];

  public readonly instance: AxiosInstance;
  // 是否正在刷新token
  public isRefreshing = false;
  public postSSE: SSE['postSSE'];
  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = [];
  public requestSSE: SSE['requestSSE'];
  public upload: FileUploader['upload'];

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: RequestClientOptions = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      responseReturn: 'raw',
      // 默认超时时间
      timeout: 10_000,
    };
    const { ...axiosConfig } = options;
    const requestConfig = merge(axiosConfig, defaultConfig);
    requestConfig.paramsSerializer = getParamsSerializer(
      requestConfig.paramsSerializer,
    );
    this.instance = axios.create(requestConfig);

    bindMethods(this);

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor =
      interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor =
      interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 实例化文件上传器
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
    // 实例化SSE模块
    const sse = new SSE(this);
    this.postSSE = sse.postSSE.bind(sse);
    this.requestSSE = sse.requestSSE.bind(sse);
  }

  /**
   * DELETE请求方法
   */
  public delete<
    TResponse = any,
    TReturn extends ResponseReturnMode | undefined = undefined,
  >(
    url: string,
    config?: RequestClientReturnConfig<TResponse, TReturn>,
  ): Promise<
    RequestReturnValue<TResponse, EffectiveReturnMode<TReturn, TDefaultReturn>>
  > {
    return this.request<TResponse, TReturn>(url, {
      ...config,
      method: 'DELETE',
    } as RequestClientReturnConfig<TResponse, TReturn>);
  }

  /**
   * GET请求方法
   */
  public get<
    TResponse = any,
    TReturn extends ResponseReturnMode | undefined = undefined,
  >(
    url: string,
    config?: RequestClientReturnConfig<TResponse, TReturn>,
  ): Promise<
    RequestReturnValue<TResponse, EffectiveReturnMode<TReturn, TDefaultReturn>>
  > {
    return this.request<TResponse, TReturn>(url, {
      ...config,
      method: 'GET',
    } as RequestClientReturnConfig<TResponse, TReturn>);
  }

  /**
   * 获取基础URL
   */
  public getBaseUrl() {
    return this.instance.defaults.baseURL;
  }

  /**
   * POST请求方法
   */
  public post<
    TResponse = any,
    TReturn extends ResponseReturnMode | undefined = undefined,
  >(
    url: string,
    data?: any,
    config?: RequestClientReturnConfig<TResponse, TReturn>,
  ): Promise<
    RequestReturnValue<TResponse, EffectiveReturnMode<TReturn, TDefaultReturn>>
  > {
    return this.request<TResponse, TReturn>(url, {
      ...config,
      data,
      method: 'POST',
    } as RequestClientReturnConfig<TResponse, TReturn>);
  }

  /**
   * PUT请求方法
   */
  public put<
    TResponse = any,
    TReturn extends ResponseReturnMode | undefined = undefined,
  >(
    url: string,
    data?: any,
    config?: RequestClientReturnConfig<TResponse, TReturn>,
  ): Promise<
    RequestReturnValue<TResponse, EffectiveReturnMode<TReturn, TDefaultReturn>>
  > {
    return this.request<TResponse, TReturn>(url, {
      ...config,
      data,
      method: 'PUT',
    } as RequestClientReturnConfig<TResponse, TReturn>);
  }

  /**
   * 通用的请求方法
   */
  public async request<
    TResponse = any,
    TReturn extends ResponseReturnMode | undefined = undefined,
  >(
    url: string,
    config: RequestClientReturnConfig<TResponse, TReturn>,
  ): Promise<
    RequestReturnValue<TResponse, EffectiveReturnMode<TReturn, TDefaultReturn>>
  > {
    try {
      const response: AxiosResponse<TResponse> = await this.instance({
        url,
        ...config,
        ...(config.paramsSerializer
          ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) }
          : {}),
      });
      return response as RequestReturnValue<
        TResponse,
        EffectiveReturnMode<TReturn, TDefaultReturn>
      >;
    } catch (error: any) {
      throw error.response || error;
    }
  }
}

export { RequestClient };

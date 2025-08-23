import type {
  Alova,
  AlovaGenerics,
  AlovaMethodCommonConfig,
  AlovaMethodCreateConfig,
  AlovaOptions,
  Method,
  RequestBody,
  RespondedAlovaGenerics,
  ResponseCompleteHandler,
  ResponseErrorHandler,
  StatesHook,
} from 'alova';
import type {
  AlovaRequestAdapterUnified,
  TokenAuthenticationResult,
} from 'alova/client';

import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';

/**
 * 请求拦截器方法类型
 */
type RequestMethod<T extends AlovaGenerics = AlovaGenerics> = (
  method: Method<T>,
) => Promise<void> | void;

/**
 * 标准响应数据结构
 */
interface ResponseData<T = unknown> {
  code?: number;
  data?: T;
  message?: string;
  [key: string]: unknown;
}

/**
 * 响应成功拦截器方法类型
 */
type ResponseSuccessMethod<T = unknown> = (
  json: ResponseData<T>,
) => Promise<ResponseData<T>>;

/**
 * Alova HTTP客户端封装类
 * @template T 泛型参数，继承自AlovaGenerics
 */
class AlovaClient<T extends AlovaGenerics = AlovaGenerics> {
  public readonly instance: Alova<T>;

  /**
   * 请求拦截器数组
   */
  public requestInterceptor: RequestMethod<T>[] = [];

  /**
   * 请求完成拦截器数组
   */
  public responseCompleteInterceptor: ResponseCompleteHandler<T>[] = [];

  /**
   * 请求错误拦截器数组
   */
  public responseErrorInterceptor: ResponseErrorHandler<T>[] = [];

  /**
   * 请求成功拦截器数组
   */
  public responseSuccessInterceptor: ResponseSuccessMethod[] = [];
  /**
   * 构造函数
   * @param options Alova配置选项
   * @param authOptions 认证选项
   */
  constructor(
    options: AlovaOptions<T>,
    authOptions: TokenAuthenticationResult<
      StatesHook<any>,
      AlovaRequestAdapterUnified
    > = {},
  ) {
    const { onAuthRequired, onResponseRefreshToken } = authOptions;
    const beforeRequest = async (method: Method<T>) => {
      for (const interceptor of this.requestInterceptor) {
        await interceptor(method);
      }
    };
    const responded = {
      // 请求成功的拦截器
      // 当使用 `alova/fetch` 请求适配器时，第一个参数接收Response对象
      // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
      onSuccess: async (response: Response, method: Method<T>) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }
        const json = await response.json();

        let result = json;
        for (const interceptor of this.responseSuccessInterceptor) {
          result = await interceptor(json);
        }

        return result;
      },

      onError: async (err: Error, method: Method<T>) => {
        for (const interceptor of this.responseErrorInterceptor) {
          await interceptor(err, method);
        }
      },

      // 请求完成的拦截器
      // 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
      // 接收当前请求的method实例
      onComplete: async (method: Method<T>) => {
        // 处理请求完成逻辑
        for (const interceptor of this.responseCompleteInterceptor) {
          await interceptor(method);
        }
      },
    };

    this.instance = createAlova({
      baseURL: '',
      requestAdapter: adapterFetch(),
      statesHook: VueHook,
      beforeRequest: onAuthRequired
        ? onAuthRequired(beforeRequest)
        : beforeRequest,
      // 使用 responded 对象分别指定请求成功的拦截器和请求失败的拦截器
      responded: onResponseRefreshToken
        ? onResponseRefreshToken(responded)
        : responded,
      ...options,
    });
  }
  /**
   * 添加请求拦截器
   * @param method 拦截器方法
   */
  public addRequestInterceptor(method: RequestMethod<T>) {
    this.requestInterceptor.push(method);
  }

  /**
   * 添加请求完成拦截器
   * @param method 拦截器方法
   */
  public addResponseCompleteInterceptor(method: ResponseCompleteHandler<T>) {
    this.responseCompleteInterceptor.push(method);
  }
  /**
   * 添加请求错误拦截器
   * @param method 拦截器方法
   */
  public addResponseErrorInterceptor(method: ResponseErrorHandler<T>) {
    this.responseErrorInterceptor.push(method);
  }
  /**
   * 添加请求成功拦截器
   * @param method 拦截器方法
   */
  public addResponseSuccessInterceptor(method: ResponseSuccessMethod) {
    this.responseSuccessInterceptor.push(method);
  }
  /**
   * 发送DELETE请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Method实例
   */
  public delete<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Delete(url, config, data);
  }
  /**
   * 发送GET请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Method实例
   */
  public get<Responded = unknown, Transformed = unknown>(
    url: string,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Get(url, config);
  }
  /**
   * 发送HEAD请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Method实例
   */
  public head<Responded = unknown, Transformed = unknown>(
    url: string,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Head(url, config);
  }
  /**
   * 发送OPTIONS请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Method实例
   */
  public options<Responded = unknown, Transformed = unknown>(
    url: string,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Options(url, config);
  }
  /**
   * 发送PATCH请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Method实例
   */
  public patch<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Patch(url, data, config);
  }
  /**
   * 发送POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Method实例
   */
  public post<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Post(url, data, config);
  }
  /**
   * 发送PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Method实例
   */
  public put<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Put(url, data, config);
  }
  /**
   * 发送自定义请求
   * @param config 请求配置
   * @returns Method实例
   */
  public request<Responded = unknown, Transformed = unknown>(
    config: AlovaMethodCommonConfig<T, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<T, Responded, Transformed>> {
    return this.instance.Request(config);
  }
}

export { AlovaClient, VueHook };
export * from 'alova';
export * from 'alova/client';

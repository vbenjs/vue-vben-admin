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
} from 'alova';
import type {
  AlovaRequestAdapterUnified,
  ClientTokenAuthenticationOptions,
} from 'alova/client';

import { createAlova } from 'alova';
import { createServerTokenAuthentication } from 'alova/client';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';

type RequestMethod = (method: Method<AlovaGenerics>) => Promise<void> | void;

class AlovaClient {
  public readonly instance: Alova<AlovaGenerics>;

  public requestInterceptor: RequestMethod[] = [];
  public responseCompleteInterceptor: ResponseCompleteHandler<AlovaGenerics>[] =
    [];
  public responseErrorInterceptor: ResponseErrorHandler<AlovaGenerics>[] = [];
  // public responseSuccessInterceptor: RespondedHandler<AlovaGenerics>[] = [];
  public responseSuccessInterceptor: ((
    Json: Record<string, any>,
  ) => Promise<Record<string, any>>)[] = [];
  constructor(
    options: AlovaOptions<AlovaGenerics>,
    tokenOptions?: ClientTokenAuthenticationOptions<AlovaRequestAdapterUnified>,
  ) {
    const { baseURL = '' } = options;
    // const { onAuthRequired, onResponseRefreshToken } =
    //   createClientTokenAuthentication<typeof VueHook>({
    //     // ...
    //     ...tokenOptions,
    //   });
    const { onAuthRequired, onResponseRefreshToken } =
      createServerTokenAuthentication<typeof VueHook>({
        // ...
        ...tokenOptions,
      });

    this.instance = createAlova({
      baseURL,
      requestAdapter: adapterFetch(),
      statesHook: VueHook,
      beforeRequest: onAuthRequired(async (method) => {
        for (const interceptor of this.requestInterceptor) {
          await interceptor(method);
        }
      }),
      // 使用 responded 对象分别指定请求成功的拦截器和请求失败的拦截器
      responded: onResponseRefreshToken({
        // 请求成功的拦截器
        // 当使用 `alova/fetch` 请求适配器时，第一个参数接收Response对象
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onSuccess: async (response, method) => {
          if (response.status >= 400) {
            throw new Error(response.statusText);
          }
          const json = await response.json();

          let result;
          for (const interceptor of this.responseSuccessInterceptor) {
            result = await interceptor(json);
          }

          return result;
        },

        onError: async (err, method) => {
          console.log(222);
          for (const interceptor of this.responseErrorInterceptor) {
            await interceptor(err, method);
          }
        },

        // 请求完成的拦截器
        // 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
        // 接收当前请求的method实例
        onComplete: async (method) => {
          // 处理请求完成逻辑
          for (const interceptor of this.responseCompleteInterceptor) {
            await interceptor(method);
          }
        },
      }),
    });
  }
  public addRequestInterceptor(
    method: (method: Method<AlovaGenerics>) => Promise<void> | void,
  ) {
    this.requestInterceptor.push(method);
  }

  public addResponseCompleteInterceptor(
    method: ResponseCompleteHandler<AlovaGenerics>,
  ) {
    this.responseCompleteInterceptor.push(method);
  }
  public addResponseErrorInterceptor(
    method: ResponseErrorHandler<AlovaGenerics>,
  ) {
    this.responseErrorInterceptor.push(method);
  }
  public addResponseSuccessInterceptor(
    method: (Json: Record<string, any>) => Promise<Record<string, any>>,
  ) {
    this.responseSuccessInterceptor.push(method);
  }
  public delete<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Delete(url, config, data);
  }
  public get<Responded = unknown, Transformed = unknown>(
    url: string,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Get(url, config);
  }
  public head<Responded = unknown, Transformed = unknown>(
    url: string,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Head(url, config);
  }
  public options<Responded = unknown, Transformed = unknown>(
    url: string,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Options(url, config);
  }
  public patch<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Patch(url, data, config);
  }
  public post<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Post(url, data, config);
  }
  public put<Responded = unknown, Transformed = unknown>(
    url: string,
    data?: RequestBody,
    config?: AlovaMethodCreateConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Put(url, data, config);
  }
  public request<Responded = unknown, Transformed = unknown>(
    config: AlovaMethodCommonConfig<AlovaGenerics, Responded, Transformed>,
  ): Method<RespondedAlovaGenerics<AlovaGenerics, Responded, Transformed>> {
    return this.instance.Request(config);
  }
}

export { AlovaClient };
export * from 'alova';
export * from 'alova/client';

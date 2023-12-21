import type { MaybeRef, Ref, WatchSource } from 'vue';

import type Fetch from './Fetch';
import type { CachedData } from './utils/cache';

export type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;
export type Subscribe = () => void;

// for Fetch
export interface FetchState<TData, TParams extends any[]> {
  loading: boolean;
  params?: TParams;
  data?: TData;
  error?: Error;
}

export interface PluginReturn<TData, TParams extends any[]> {
  onBefore?: (params: TParams) =>
    | ({
        stopNow?: boolean;
        returnNow?: boolean;
      } & Partial<FetchState<TData, TParams>>)
    | void;

  onRequest?: (
    service: Service<TData, TParams>,
    params: TParams,
  ) => {
    servicePromise?: Promise<TData>;
  };

  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (e: Error, params: TParams) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
  onMutate?: (data: TData) => void;
}

// for useRequestImplement
export interface UseRequestOptions<TData, TParams extends any[]> {
  manual?: MaybeRef<boolean>;

  onBefore?: (params: TParams) => void;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (e: Error, params: TParams) => void;
  // formatResult?: (res: any) => TData;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;

  defaultParams?: TParams;

  // refreshDeps
  refreshDeps?: WatchSource<any>[];
  refreshDepsAction?: () => void;

  // loading delay
  loadingDelay?: number;

  // polling
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  pollingErrorRetryCount?: number;

  // refresh on window focus
  refreshOnWindowFocus?: boolean;
  focusTimespan?: number;

  // debounce
  debounceWait?: number;
  debounceLeading?: boolean;
  debounceTrailing?: boolean;
  debounceMaxWait?: number;

  // throttle
  throttleWait?: number;
  throttleLeading?: boolean;
  throttleTrailing?: boolean;

  // cache
  cacheKey?: string;
  cacheTime?: number;
  staleTime?: number;
  setCache?: (data: CachedData<TData, TParams>) => void;
  getCache?: (params: TParams) => CachedData<TData, TParams> | undefined;

  // retry
  retryCount?: number;
  retryInterval?: number;

  // ready
  ready?: MaybeRef<boolean>;

  // [key: string]: any;
}

export interface UseRequestPlugin<TData, TParams extends any[]> {
  // eslint-disable-next-line prettier/prettier
  (fetchInstance: Fetch<TData, TParams>, options: UseRequestOptions<TData, TParams>): PluginReturn<
    TData,
    TParams
  >;
  onInit?: (options: UseRequestOptions<TData, TParams>) => Partial<FetchState<TData, TParams>>;
}

// for index
// export type OptionsWithoutFormat<TData, TParams extends any[]> = Omit<Options<TData, TParams>, 'formatResult'>;

// export interface OptionsWithFormat<TData, TParams extends any[], TFormated, TTFormated extends TFormated = any> extends Omit<Options<TTFormated, TParams>, 'formatResult'> {
//   formatResult: (res: TData) => TFormated;
// };

export interface UseRequestResult<TData, TParams extends any[]> {
  loading: Ref<boolean>;
  data: Ref<TData>;
  error: Ref<Error>;
  params: Ref<TParams | []>;
  cancel: Fetch<TData, TParams>['cancel'];
  refresh: Fetch<TData, TParams>['refresh'];
  refreshAsync: Fetch<TData, TParams>['refreshAsync'];
  run: Fetch<TData, TParams>['run'];
  runAsync: Fetch<TData, TParams>['runAsync'];
  mutate: Fetch<TData, TParams>['mutate'];
}

export type UseRequestTimeout = ReturnType<typeof setTimeout>;

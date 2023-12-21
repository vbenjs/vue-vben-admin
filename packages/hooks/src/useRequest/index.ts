import useAutoRunPlugin from './plugins/useAutoRunPlugin';
import useCachePlugin from './plugins/useCachePlugin';
import useDebouncePlugin from './plugins/useDebouncePlugin';
import useLoadingDelayPlugin from './plugins/useLoadingDelayPlugin';
import usePollingPlugin from './plugins/usePollingPlugin';
import useRefreshOnWindowFocusPlugin from './plugins/useRefreshOnWindowFocusPlugin';
import useRetryPlugin from './plugins/useRetryPlugin';
import useThrottlePlugin from './plugins/useThrottlePlugin';
import type { Service, UseRequestOptions, UseRequestPlugin } from './types';
import { useRequestImplement } from './useRequestImplement';

export { clearCache } from './utils/cache';

export function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: UseRequestOptions<TData, TParams>,
  plugins?: UseRequestPlugin<TData, TParams>[],
) {
  return useRequestImplement<TData, TParams>(service, options, [
    ...(plugins || []),
    useDebouncePlugin,
    useLoadingDelayPlugin,
    usePollingPlugin,
    useRefreshOnWindowFocusPlugin,
    useThrottlePlugin,
    useAutoRunPlugin,
    useCachePlugin,
    useRetryPlugin,
  ] as UseRequestPlugin<TData, TParams>[]);
}

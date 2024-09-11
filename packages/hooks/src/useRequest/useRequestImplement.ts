/* eslint-disable @typescript-eslint/ban-ts-comment */
import { onMounted, onUnmounted, toRefs } from 'vue';

import Fetch from './Fetch';
import type { Service, UseRequestOptions, UseRequestPlugin, UseRequestResult } from './types';

export function useRequestImplement<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options: UseRequestOptions<TData, TParams> = {},
  plugins: UseRequestPlugin<TData, TParams>[] = [],
) {
  const { manual = false, ...rest } = options;
  const fetchOptions = { manual, ...rest };

  const initState = plugins.map((p) => p?.onInit?.(fetchOptions)).filter(Boolean);

  const fetchInstance = new Fetch<TData, TParams>(
    service,
    fetchOptions,
    () => {},
    Object.assign({}, ...initState),
  );

  fetchInstance.options = fetchOptions;
  // run all plugins hooks
  fetchInstance.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions));

  onMounted(() => {
    if (!manual) {
      const params = fetchInstance.state.params || options.defaultParams || [];
      // @ts-ignore
      fetchInstance.run(...params);
    }
  });

  onUnmounted(() => {
    fetchInstance.cancel();
  });

  return {
    ...toRefs(fetchInstance.state),
    cancel: fetchInstance.cancel.bind(fetchInstance),
    mutate: fetchInstance.mutate.bind(fetchInstance),
    refresh: fetchInstance.refresh.bind(fetchInstance),
    refreshAsync: fetchInstance.refreshAsync.bind(fetchInstance),
    run: fetchInstance.run.bind(fetchInstance),
    runAsync: fetchInstance.runAsync.bind(fetchInstance),
  } as UseRequestResult<TData, TParams>;
}

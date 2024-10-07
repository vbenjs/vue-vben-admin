import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import { defineComponent, h, onBeforeUnmount } from 'vue';

import { useStore } from '@vben-core/shared/store';

import { VxeGridApi } from './api';
import VxeGrid from './use-vxe-grid.vue';

export function useVbenVxeGrid(options: VxeGridProps) {
  // const IS_REACTIVE = isReactive(options);
  const api = new VxeGridApi(options);
  const extendedApi: ExtendedVxeGridApi = api as ExtendedVxeGridApi;
  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Grid = defineComponent(
    (props: VxeGridProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...attrs });
      return () => h(VxeGrid, { ...props, ...attrs, api: extendedApi }, slots);
    },
    {
      inheritAttrs: false,
      name: 'VbenVxeGrid',
    },
  );
  // Add reactivity support
  // if (IS_REACTIVE) {
  //   watch(
  //     () => options,
  //     () => {
  //       api.setState(options);
  //     },
  //     { immediate: true },
  //   );
  // }

  return [Grid, extendedApi] as const;
}

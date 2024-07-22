import { useRouter } from 'vue-router';

import { useCoreTabbarStore } from '@vben/stores';

export function useRefresh() {
  const router = useRouter();
  const coreTabbarStore = useCoreTabbarStore();

  function refresh() {
    coreTabbarStore.refresh(router);
  }

  return {
    refresh,
  };
}

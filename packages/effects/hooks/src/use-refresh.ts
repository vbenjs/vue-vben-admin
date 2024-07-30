import { useRouter } from 'vue-router';

import { useTabbarStore } from '@vben/stores';

export function useRefresh() {
  const router = useRouter();
  const tabbarStore = useTabbarStore();

  function refresh() {
    tabbarStore.refresh(router);
  }

  return {
    refresh,
  };
}

import { computed, unref } from 'vue';

import { useAppProviderContext } from '@/components/Application';

export function useAppInject() {
  const values = useAppProviderContext();

  return {
    getIsMobile: computed(() => unref(values.isMobile)),
  };
}

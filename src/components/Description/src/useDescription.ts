import { ref, getCurrentInstance, unref } from 'vue';
import { isProdMode } from '/@/utils/env';

import type { DescOptions, DescInstance, UseDescReturnType } from './types';

export function useDescription(props?: Partial<DescOptions>): UseDescReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useDescription function in the setup function!');
  }
  const descRef = ref<DescInstance | null>(null);
  const loadedRef = ref(false);

  function register(instance: DescInstance) {
    if (unref(loadedRef) && isProdMode()) {
      return;
    }
    descRef.value = instance;
    props && instance.setDescProps(props);
    loadedRef.value = true;
  }

  const methods: DescInstance = {
    setDescProps: (descProps: Partial<DescOptions>): void => {
      unref(descRef)!.setDescProps(descProps);
    },
  };
  return [register, methods];
}

import { ref, getCurrentInstance, unref } from 'compatible-vue';
import { isProdMode } from '@/utils/envUtil';

import { DescOptions, DescInstance, UseDescReturnType } from './type';

export function useDescription(props?: Partial<DescOptions>): UseDescReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useDescription function in the setup function!');
  }
  const descRef = ref<DescInstance | null>(null);
  const loadedRef = ref(false);

  function getDescription(instance: DescInstance) {
    if (unref(loadedRef) && isProdMode()) {
      return;
    }
    descRef.value = instance;
    props && instance.setProps(props);
    loadedRef.value = true;
  }
  const methods: DescInstance = {
    setProps: (descProps: Partial<DescOptions>): void => {
      unref(descRef)!.setProps(descProps);
    },
  };
  return [getDescription, methods];
}

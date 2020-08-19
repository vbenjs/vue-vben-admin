import { add, del } from '@/components/form/src/componentMap';
import { onUnmounted } from 'compatible-vue';

import { ComponentType } from './types/index';
export function useComponentRegister(compName: ComponentType, comp: any) {
  add(compName, comp);
  onUnmounted(() => {
    del(compName);
  });
}

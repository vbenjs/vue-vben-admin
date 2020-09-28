import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { add, del } from '../componentMap';

import { ComponentType } from '../types/index';
export function useComponentRegister(compName: ComponentType, comp: any) {
  add(compName, comp);
  tryOnUnmounted(() => {
    del(compName);
  });
}

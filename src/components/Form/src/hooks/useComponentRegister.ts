import type { ComponentType } from '../types/index';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { add, del } from '../componentMap';
export function useComponentRegister(compName: ComponentType, comp: any) {
  add(compName, comp);
  tryOnUnmounted(() => {
    del(compName);
  });
}

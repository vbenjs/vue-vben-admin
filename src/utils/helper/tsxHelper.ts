import { VNode } from 'compatible-vue';
import { isFunction } from '@/utils/is/index';

interface Slots {
  [key: string]: (...args: any[]) => VNode[];
}

/**
 * @description:  获取slot 防止为空报错
 */
export function getSlot(slots: Slots, slot: string) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`);
    return null;
  }
  return slots[slot]();
}

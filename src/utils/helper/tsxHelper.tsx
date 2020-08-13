import { VNode } from 'compatible-vue';
import { isFunction } from '@/utils/is/index';
import { omit } from '@/utils/lodashChunk';
interface Slots {
  [key: string]: (...args: any[]) => VNode[];
}

/**
 * @description:  获取slot 防止为空报错
 */
export function getSlot(slots: Slots, slot = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`);
    return null;
  }
  return slots[slot](data);
}

export function getSlotFunc(slots: Slots) {
  return omit(slots, isFunction);
}

/**
 * 继承slots
 * @param slots
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots);
  return slotKeys.map((key) => {
    if (excludeKeys.includes(key)) {
      return null;
    }
    return <template slot={key}>{getSlot(slots, key)}</template>;
  });
}

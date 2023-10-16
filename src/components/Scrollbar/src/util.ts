import type { BarMap } from './types';
import type { MergeAll } from '/@/utils/types';

export const BAR_MAP: BarMap = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
};

// @ts-ignore
export function renderThumbStyle({ move, size, bar }) {
  const style = {} as any;
  const translate = `translate${bar.axis}(${move}%)`;

  style[bar.size] = size;
  style.transform = translate;
  style.msTransform = translate;
  style.webkitTransform = translate;

  return style;
}

function extend<T extends object, K extends object>(to: T, _from: K): T & K {
  return Object.assign(to, _from);
}

/**
 * [
 *  { name: 'zhangsan', age: 18 },
 *  { sex: 'male', age: 20 }
 * ]
 * =>
 * { name: 'zhangsan', sex: 'male', age: 20 }
 */
export function toObject<T extends object[]>(arr: T): MergeAll<T> {
  const res = {} as MergeAll<T>;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

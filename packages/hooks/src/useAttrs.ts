import { type Recordable } from '@vben/types';
import { getCurrentInstance, reactive, type ShallowRef, shallowRef, watchEffect } from 'vue';

interface UseAttrsOptions {
  /**
   * @description 排除监听事件
   * @default false
   */
  excludeListeners?: boolean;
  /**
   * @description 排除部分对象 key值
   * @default []
   */
  excludeKeys?: string[];
  /**
   * @description 排除默认值 key 值 ['class', 'style']
   * @default true
   */
  excludeDefaultKeys?: boolean;
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];
const LISTENER_PREFIX = /^on[A-Z]/;

function entries<T>(obj: Recordable<T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]]);
}

/**
 * @description 获取当前组件的 Attrs 属性
 * @param UseAttrsOptions
 */
function useAttrs<T = any>(options: UseAttrsOptions = {}): ShallowRef<Recordable<T>> {
  const instance = getCurrentInstance();
  const attrs = shallowRef({});

  if (!instance) {
    return attrs;
  }

  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = options;
  const allExcludeKeys = excludeKeys.concat(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []);

  // Since attrs are not reactive, make it reactive instead of doing in `onUpdated` hook for better performance
  instance.attrs = reactive(instance.attrs);

  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (!allExcludeKeys.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))) {
        acm[key] = val;
      }

      return acm;
    }, {} as Recordable<any>);

    attrs.value = res;
  });

  return attrs;
}

export { useAttrs, type UseAttrsOptions };

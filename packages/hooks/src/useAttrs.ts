import { type Recordable } from '@vben/types';
import { getCurrentInstance, reactive, shallowRef, watchEffect } from 'vue';

interface UseAttrsOptions {
  excludeListeners?: boolean;
  excludeKeys?: string[];
  excludeDefaultKeys?: boolean;
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];
const LISTENER_PREFIX = /^on[A-Z]/;

function entries<T>(obj: Recordable<T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]]);
}

function useAttrs(options: UseAttrsOptions = {}): Recordable<any> {
  const instance = getCurrentInstance();
  if (!instance) return {};

  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = options;
  const attrs = shallowRef({});
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

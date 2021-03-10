import type { FunctionalComponent } from 'vue';
import type { RouteLocation } from 'vue-router';
import { computed, ref, unref, getCurrentInstance } from 'vue';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const ParentLayoutName = 'ParentLayout';

const PAGE_LAYOUT_KEY = '__PAGE_LAYOUT__';

export function getKey(component: FunctionalComponent & { type: Indexable }, route: RouteLocation) {
  return !!component?.type.parentView ? {} : { key: route.fullPath };
}

export function useCache(isPage: boolean) {
  const { getters } = useStore();

  const name = ref('');
  const { currentRoute } = useRouter();
  const instance = getCurrentInstance();
  const routeName = instance?.type.name;
  if (routeName && ![ParentLayoutName].includes(routeName)) {
    name.value = routeName;
  } else {
    const matched = currentRoute.value?.matched;
    if (!matched) {
      return;
    }
    const len = matched.length;
    if (len < 2) return;
    name.value = matched[len - 2].name as string;
  }

  const { getOpenKeepAlive } = useRootSetting();

  const getCaches = computed((): string[] => {
    if (!unref(getOpenKeepAlive)) {
      return [];
    }
    const cached = getters['app-tab/getCachedMapState'];

    if (isPage) {
      //  page Layout
      return cached.get(PAGE_LAYOUT_KEY) || [];
    }
    const cacheSet = new Set<string>();
    cacheSet.add(unref(name));

    const list = cached.get(unref(name));

    if (!list) {
      return Array.from(cacheSet);
    }
    list.forEach((item) => {
      cacheSet.add(item);
    });

    return Array.from(cacheSet);
  });
  return { getCaches };
}

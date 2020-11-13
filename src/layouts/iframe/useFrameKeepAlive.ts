import type { AppRouteRecordRaw } from '/@/router/types';

import { computed, toRaw, unref } from 'vue';
import { useRouter } from 'vue-router';
import router from '/@/router';

import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';

import { unique } from '/@/utils';

export function useFrameKeepAlive() {
  const { currentRoute } = useRouter();

  function getAllFramePages(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
    let res: AppRouteRecordRaw[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = unique(res, 'name');
    return res;
  }

  function showIframe(item: AppRouteRecordRaw) {
    return item.path === unref(currentRoute).path;
  }
  const getFramePages = computed(() => {
    const ret =
      getAllFramePages((toRaw(router.getRoutes()) as unknown) as AppRouteRecordRaw[]) || [];
    return ret;
  });

  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabsState.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.path!);
      }
      return prev;
    }, []);
  });

  function hasRenderFrame(path: string) {
    const {
      multiTabsSetting: { show },
    } = appStore.getProjectConfig;
    return show ? unref(getOpenTabList).includes(path) : true;
  }
  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}

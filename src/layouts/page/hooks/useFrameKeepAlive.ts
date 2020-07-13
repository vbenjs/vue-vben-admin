import { computed, unref } from 'compatible-vue';

import { permissionStore } from '@/store/modules/permission';
import { tabStore } from '@/store/modules/tab';
import { appStore } from '@/store/modules/app';

import { RouteConfigEx } from '@/router/types';

import { useRouter } from '@/hooks/core/useRouter';

export function useFrameKeepAlive() {
  const { route } = useRouter();

  function getAllFramePages(routes: RouteConfigEx[]): RouteConfigEx[] {
    const res: RouteConfigEx[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    return res;
  }
  function showIframe(item: RouteConfigEx) {
    return item.path === unref(route).path;
  }
  const getFramePages = computed(() => {
    const authRoutes = permissionStore.getRoutesState;
    return getAllFramePages(authRoutes) || [];
  });

  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabsState.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.path);
      }
      return prev;
    }, []);
  });

  function hasRenderFrame(path: string) {
    const {
      multiTabsSetting: { show },
    } = appStore.getProjCfg;
    return show ? unref(getOpenTabList).includes(path) : true;
  }
  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}

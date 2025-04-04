import type { RouteRecordNormalized } from 'vue-router';

import { useRouter } from 'vue-router';

import { isHttpUrl, openRouteInNewWindow, openWindow } from '@vben/utils';

function useNavigation() {
  const router = useRouter();
  const routes = router.getRoutes();

  const routeMetaMap = new Map<string, RouteRecordNormalized>();

  routes.forEach((route) => {
    routeMetaMap.set(route.path, route);
  });

  const navigation = async (path: string) => {
    const route = routeMetaMap.get(path);
    const { openInNewWindow = false, query = {} } = route?.meta ?? {};
    if (isHttpUrl(path)) {
      openWindow(path, { target: '_blank' });
    } else if (openInNewWindow) {
      openRouteInNewWindow(path);
    } else {
      await router.push({
        path,
        query,
      });
    }
  };

  const willOpenedByWindow = (path: string) => {
    const route = routeMetaMap.get(path);
    const { openInNewWindow = false } = route?.meta ?? {};
    if (isHttpUrl(path)) {
      return true;
    } else if (openInNewWindow) {
      return true;
    } else {
      return false;
    }
  };

  return { navigation, willOpenedByWindow };
}

export { useNavigation };

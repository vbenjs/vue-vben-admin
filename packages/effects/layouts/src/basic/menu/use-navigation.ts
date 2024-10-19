import { useRouter } from 'vue-router';

import { isHttpUrl, openWindow } from '@vben/utils';

function useNavigation() {
  const router = useRouter();
  const routes = router.getRoutes();

  const routeMetaMap = new Map<string, any>();

  routes.forEach((route) => {
    routeMetaMap.set(route.path, route.meta);
  });

  const navigation = async (path: string) => {
    if (isHttpUrl(path)) {
      openWindow(path, { target: '_blank' });
    } else {
      const meta = routeMetaMap.get(path);
      const query = meta?.query ?? {};
      await router.push({
        path,
        query,
      });
    }
  };

  return { navigation };
}

export { useNavigation };

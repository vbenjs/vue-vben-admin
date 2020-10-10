import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { RouteRecordRaw } from 'vue-router';

import { appStore } from '/@/store/modules/app';
import { tabStore } from '/@/store/modules/tab';
import { createRouter, createWebHashHistory } from 'vue-router';
import { toRaw } from 'vue';
import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';
export function genRouteModule(moduleList: AppRouteModule[]) {
  const ret: AppRouteRecordRaw[] = [];
  for (const routeMod of moduleList) {
    const routes = routeMod.routes as any;
    const layout = routeMod.layout;
    const router = createRouter({ routes, history: createWebHashHistory() });

    const flatList = toRaw(router.getRoutes()).filter((item) => item.children.length === 0);
    try {
      (router as any) = null;
    } catch (error) {}

    flatList.forEach((item) => {
      item.path = `${layout.path}${item.path}`;
    });
    layout.children = (flatList as unknown) as AppRouteRecordRaw[];
    ret.push(layout);
  }
  return ret as RouteRecordRaw[];
}

function asyncImportRoute(routes: AppRouteRecordRaw[]) {
  routes.forEach((item) => {
    const { component, children } = item;
    if (component) {
      item.component = () => import(`/@/views/${component}`);
    }
    children && asyncImportRoute(children);
  });
}

export function transformObjToRoute(routeList: AppRouteModule[]) {
  routeList.forEach((route) => {
    asyncImportRoute(route.routes);
    if (route.layout) {
      route.layout.component =
        route.layout.component === 'PAGE_LAYOUT' ? PAGE_LAYOUT_COMPONENT : '';
    }
  });
  return routeList;
}

export function getIsOpenTab(toPath: string) {
  const { openKeepAlive, multiTabsSetting: { show } = {} } = appStore.getProjectConfig;

  if (show && openKeepAlive) {
    const tabList = tabStore.getTabsState;
    return tabList.some((tab) => tab.path === toPath);
  }
  return false;
}

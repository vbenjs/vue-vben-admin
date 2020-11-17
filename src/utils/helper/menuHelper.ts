import { AppRouteModule, RouteModule } from '/@/router/types.d';
import type { MenuModule, Menu, AppRouteRecordRaw } from '/@/router/types';

import { findPath, forEach, treeMap, treeToList } from './treeHelper';
import { cloneDeep } from 'lodash-es';

export function getAllParentPath(treeData: any[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

export function flatMenus(menus: Menu[]) {
  return treeToList(menus);
}

// 拼接父级路径
function joinParentPath(list: any, node: any) {
  let allPaths = getAllParentPath(list, node.path);

  allPaths = allPaths.slice(0, allPaths.length - 1);
  let parentPath = '';
  if (Array.isArray(allPaths) && allPaths.length >= 2) {
    parentPath = allPaths[allPaths.length - 1];
  } else {
    allPaths.forEach((p) => {
      parentPath += /^\//.test(p) ? p : `/${p}`;
    });
  }
  node.path = `${parentPath}${/^\//.test(node.path) ? node.path : `/${node.path}`}`.replace(
    /\/\//g,
    '/'
  );
  return node;
}

// 解析菜单模块
export function transformMenuModule(menuModule: MenuModule): Menu {
  const { menu } = menuModule;

  const menuList = [menu];
  forEach(menuList, (m) => {
    joinParentPath(menuList, m);
  });
  return menuList[0];
}

export function transformRouteToMenu(routeModList: AppRouteModule[]) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];
  cloneRouteModList.forEach((item) => {
    const { layout, routes, children } = item as RouteModule;
    if (layout) {
      layout.children = routes || children;
      routeList.push(layout);
    } else {
      routes && routeList.push(...routes);
    }
  });
  return treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, icon } = {} } = node;
      joinParentPath(routeList, node);
      return {
        name: title,
        icon,
        path: node.path,
      };
    },
  });
}

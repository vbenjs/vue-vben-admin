import { AppRouteModule } from '/@/router/types';
import type { MenuModule, Menu, AppRouteRecordRaw } from '/@/router/types';

import { findPath, forEach, treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { isUrl } from '/@/utils/is';

export function getAllParentPath(treeData: any[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
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
  node.path = `${/^\//.test(node.path) ? node.path : `${parentPath}/${node.path}`}`.replace(
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
    !isUrl(m.path) && joinParentPath(menuList, m);
  });

  return menuList[0];
}

export function transformRouteToMenu(routeModList: AppRouteModule[]) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];

  cloneRouteModList.forEach((item) => {
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  return treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, icon, hideMenu = false } = {} } = node;

      !isUrl(node.path) && joinParentPath(routeList, node);
      return {
        name: title,
        icon,
        path: node.path,
        hideMenu,
      };
    },
  });
}

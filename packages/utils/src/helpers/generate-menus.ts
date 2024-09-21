import type { ExRouteRecordRaw, MenuRecordRaw } from '@vben-core/typings';
import type { Router, RouteRecordRaw } from 'vue-router';

import { filterTree, mapTree } from '@vben-core/shared/utils';

/**
 * 根据 routes 生成菜单列表
 * @param routes
 */
async function generateMenus(
  routes: RouteRecordRaw[],
  router: Router,
): Promise<MenuRecordRaw[]> {
  // 将路由列表转换为一个以 name 为键的对象映射
  // 获取所有router最终的path及name
  const finalRoutesMap: { [key: string]: string } = Object.fromEntries(
    router.getRoutes().map(({ name, path }) => [name, path]),
  );

  let menus = mapTree<ExRouteRecordRaw, MenuRecordRaw>(routes, (route) => {
    // 路由表的路径写法有多种，这里从router获取到最终的path并赋值
    const path = finalRoutesMap[route.name as string] ?? route.path;

    // 转换为菜单结构
    // const path = matchRoute?.path ?? route.path;
    const { meta, name: routeName, redirect, children } = route;
    const {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      hideChildrenInMenu = false,
      icon,
      link,
      order,
      title = '',
    } = meta || {};

    const name = (title || routeName || '') as string;

    // 隐藏子菜单
    const resultChildren = hideChildrenInMenu
      ? []
      : (children as MenuRecordRaw[]);

    // 将菜单的所有父级和父级菜单记录到菜单项内
    if (resultChildren && resultChildren.length > 0) {
      resultChildren.forEach((child) => {
        child.parents = [...(route.parents || []), path];
        child.parent = path;
      });
    }
    // 隐藏子菜单
    const resultPath = hideChildrenInMenu ? redirect || path : link || path;
    return {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      icon,
      name,
      order,
      parent: route.parent,
      parents: route.parents,
      path: resultPath as string,
      show: !route?.meta?.hideInMenu,
      children: resultChildren || [],
    };
  });

  // 对菜单进行排序
  menus = menus.sort((a, b) => (a.order || 999) - (b.order || 999));

  const finalMenus = filterTree(menus, (menu) => {
    return !!menu.show;
  });
  return finalMenus;
}

export { generateMenus };

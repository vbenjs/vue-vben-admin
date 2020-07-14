import { buildUUID } from '@/utils/uuid';
import { isArray } from '@/utils/is/index';
import {
  MenuItem,
  FormatConfig,
  // FormatMenuResult,
  BuildMenuModuleResult,
  RouteConfigEx,
} from '@/router/types';

import { list2Tree, treeMap } from '@/utils/helper/treeHelper';
// import { menuStore } from '@/store/modules/menu';

let flatMenus: MenuItem[] = [];
const rootRoutes: RouteConfigEx[] = [];

/**
 * @description: 生成树级
 */
function formatterMenu({ menu, parentPath = '', parentId = null }: FormatConfig, addPrefix = true) {
  const fixedParentPath = parentPath.replace(/\/{1,}/g, '/');

  // 设置层级id
  if (!isArray(menu)) {
    menu.id = buildUUID();
    const { children, path, id } = menu;

    const isAddPrefix = (menu as any).isAddPrefix;

    const fixedPath = path.replace(/\/{1,}/g, '/');
    menu.parentId = parentId;

    let menuPath = '';
    const match = (/^\/(.*)\//.exec(fixedPath) || [])[0];
    if (path !== match && !isAddPrefix && addPrefix) {
      menuPath = fixedParentPath + fixedPath;
    } else {
      menuPath = fixedPath;
    }
    menu.path = menuPath;

    // menu.path = `${menu.path.startsWith(fixedParentPath) ? '' : fixedParentPath}${fixedPath}`;

    Reflect.defineProperty(menu, 'isAddPrefix', {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false,
    });
    if (children && isArray(children)) {
      formatterMenu(
        {
          menu: children,
          parentPath: menu.path,
          parentId: id,
        },
        addPrefix
      );
    }
    const menuByRoute = rootRoutes.find((item) => item.path === menu.path);

    // if (rootRoutes.some((item) => item.path === menu.path)) {
    // }
    if (menuByRoute && menuByRoute.meta) {
      menu.roles = menuByRoute.meta.roles;
      menu.icon = menu.icon || menuByRoute.meta.icon;
    }

    flatMenus.push(menu);
  } else {
    for (const menuItem of menu) {
      formatterMenu(
        {
          menu: menuItem,
          parentPath: parentPath,
          parentId: parentId,
        },
        addPrefix
      );
    }
  }
}

/**
 * @description:扁平化路由
 */
function flatRootRoutes(routeList: RouteConfigEx[]) {
  routeList.forEach((route) => {
    rootRoutes.push(route);
    if (route.children) {
      flatRootRoutes(route.children);
    }
  });
}
/**
 * @description: 生成菜单模块
 */
export function buildMenuModule(routes: RouteConfigEx[]): BuildMenuModuleResult {
  const routeList = routes.find((item) => item.path === '/')!.children as RouteConfigEx[];
  flatRootRoutes(routeList);

  flatMenus = [];
  const menuList = require.context('@/router/menus/', true, /^[^_]*\.ts$/);

  menuList.keys().forEach((fileName: string) => {
    try {
      const menuModule = menuList(fileName).default as MenuItem;
      const orderNo = menuList(fileName).orderNo as number;
      formatterMenu({ menu: { ...menuModule, orderNo: orderNo || 100 } });
    } catch (error) {
      throw new Error(error);
    }
  });
  const list = list2Tree<MenuItem>(flatMenus);
  return { allMenus: list, flatMenus };
}

/**
 * 路由结构转菜单
 */
export function transformRouteToMenu(routes: RouteConfigEx[]): BuildMenuModuleResult {
  flatMenus = [];
  let menuList = treeMap(routes, {
    conversion: (item: RouteConfigEx) => {
      const { children = [] } = item;
      return {
        name: item.meta!.title,
        path: item.path,
        children: children.length ? children : undefined,
      };
    },
  });
  menuList = menuList.filter((item) => item.name !== 'Redirect');
  menuList.forEach((menu) => {
    menu && formatterMenu({ menu }, false);
  });

  return {
    allMenus: menuList,
    flatMenus,
  };
}

import { buildUUID } from '@/utils/uuid';
import { isArray } from '@/utils/is/index';
import {
  MenuItem,
  FormatConfig,
  // FormatMenuResult,
  BuildMenuModuleResult,
  RouteConfigEx,
} from '@/router/types';

import { list2Tree } from '@/utils/helper/treeHelper';
import { sort } from '@/router/helper/routeHelper';
// import { menuStore } from '@/store/modules/menu';
import { getAsyncRoutes } from '@/router/index';

// import { getMenuApi } from '@/api/sys';

let flatMenus: MenuItem[] = [];
const rootRoutes: RouteConfigEx[] = [];

/**
 * @description: 生成树级
 */
function formatterMenu({ menu, parentPath = '', parentId = null }: FormatConfig) {
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
    if (path !== match && !isAddPrefix) {
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
      formatterMenu({
        menu: children,
        parentPath: menu.path,
        parentId: id,
      });
    }
    const menuByRoute = rootRoutes.find((item) => item.path === menu.path);
    // if (rootRoutes.some((item) => item.path === menu.path)) {
    // }
    if (menuByRoute && menuByRoute.meta && menuByRoute.meta.roles) {
      menu.roles = menuByRoute.meta.roles;
    }
    flatMenus.push(menu);
  } else {
    for (const menuItem of menu) {
      formatterMenu({
        menu: menuItem,
        parentPath: parentPath,
        parentId: parentId,
      });
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

export async function buildMenuList(): Promise<BuildMenuModuleResult> {
  // const { flatMenus, allMenus } = buildMenuModule(permissionStore.getRoutesState);
  const { flatMenus, allMenus } = buildMenuModule(getAsyncRoutes());
  const menus = sort(allMenus);
  // menuStore.commitMenuListState(menus);
  // menuStore.commitFlatMenuListState(sort(flatMenus));
  return {
    allMenus: menus,
    flatMenus,
  };
}

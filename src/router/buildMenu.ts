import { buildUUID } from '@/utils/uuid';
import { isArray } from '@/utils/is/index';
import { sort } from './util';
import {
  MenuItem,
  FormatConfig,
  // FormatMenuResult,
  BuildMenuModuleResult,
  RouteConfigEx,
} from '@/router/type';

import { permissionStore } from '@/store/modules/permission';

import { list2Tree } from '@/utils/helper/treeHelper';

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
    const fixedPath = path.replace(/\/{1,}/g, '/');
    menu.parentId = parentId;
    menu.path = `${menu.path.startsWith(fixedParentPath) ? '' : fixedParentPath}${fixedPath}`;
    if (children && isArray(children)) {
      formatterMenu({
        menu: children,
        parentPath: menu.path,
        parentId: id,
      });
    }
    if (rootRoutes.some((item) => item.path === menu.path)) {
      flatMenus.push(menu);
    }
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
function buildMenuModule(routes: RouteConfigEx[]): BuildMenuModuleResult {
  const routeList = routes.find((item) => item.path === '/')!.children as RouteConfigEx[];
  flatRootRoutes(routeList);

  flatMenus = [];
  const menuList = require.context('./menus/', true, /^[^_]*\.ts$/);

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

// TODO 异步加载  可用于菜单从后台读取
export async function buildMenu(): Promise<BuildMenuModuleResult> {
  const { flatMenus, allMenus } = buildMenuModule(permissionStore.getRoutesState);
  // getMenuApi({ username: 'admin' }).then((result) => {
  //   console.log('======================');
  //   console.log('菜单信息', result);
  //   console.log('======================');
  // });

  return {
    allMenus: sort(allMenus),
    flatMenus,
  };
}

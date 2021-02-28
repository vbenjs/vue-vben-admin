import type { Menu, MenuModule } from '/@/router/types';
import type { RouteRecordNormalized } from 'vue-router';

import { appStore } from '/@/store/modules/app';
import { permissionStore } from '/@/store/modules/permission';
import { transformMenuModule, getAllParentPath } from '/@/router/helper/menuHelper';
import { filter } from '/@/utils/helper/treeHelper';
import router from '/@/router';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { pathToRegexp } from 'path-to-regexp';

const modules = import.meta.globEager('./modules/**/*.ts');

const menuModules: MenuModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  menuModules.push(...modList);
});

const reg = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

// ===========================
// ==========Helper===========
// ===========================
const isBackMode = () => {
  return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK;
};

const staticMenus: Menu[] = [];
(() => {
  menuModules.sort((a, b) => {
    return (a.orderNo || 0) - (b.orderNo || 0);
  });

  for (const menu of menuModules) {
    staticMenus.push(transformMenuModule(menu));
  }
})();

async function getAsyncMenus() {
  // 前端角色控制菜单 直接取菜单文件
  return !isBackMode() ? staticMenus : permissionStore.getBackMenuListState;
}

// 获取菜单 树级
export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus();
  const routes = router.getRoutes();
  return !isBackMode() ? filter(menus, basicFilter(routes)) : menus;
};

// 获取当前路径的顶级路径
export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();

  const allParentPath = await getAllParentPath(menus, currentPath);

  return allParentPath?.[0];
}

// 获取1级菜单，删除children
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus();
  const routes = router.getRoutes();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  return !isBackMode() ? shallowMenuList.filter(basicFilter(routes)) : shallowMenuList;
}

// 获取菜单的children
export async function getChildrenMenus(parentPath: string) {
  const menus = await getAsyncMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent || !parent.children) return [] as Menu[];
  const routes = router.getRoutes();

  return !isBackMode() ? filter(parent.children, basicFilter(routes)) : parent.children;
}

// 通用过滤方法
function basicFilter(routes: RouteRecordNormalized[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find((route) => {
      const match = route.path.match(reg)?.[0];
      if (match && match === menu.path) {
        return true;
      }

      if (route.meta?.carryParam) {
        return pathToRegexp(route.path).test(menu.path);
      }
      const isSame = route.path === menu.path;
      if (!isSame) return false;

      if (route.meta?.ignoreAuth) return true;

      return isSame || pathToRegexp(route.path).test(menu.path);
    });

    if (!matchRoute) return false;
    menu.icon = (menu.icon || matchRoute.meta.icon) as string;
    menu.meta = matchRoute.meta;
    return true;
  };
}

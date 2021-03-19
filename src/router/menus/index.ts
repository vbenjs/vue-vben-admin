import type { Menu, MenuModule } from '/@/router/types';
import type { RouteRecordNormalized } from 'vue-router';

import { appStore } from '/@/store/modules/app';
import { permissionStore } from '/@/store/modules/permission';
import { transformMenuModule, getAllParentPath } from '/@/router/helper/menuHelper';
import { filter } from '/@/utils/helper/treeHelper';
import { isUrl } from '/@/utils/is';
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
  return !isBackMode() ? staticMenus : permissionStore.getBackMenuListState;
}

export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus();
  const routes = router.getRoutes();
  return !isBackMode() ? filter(menus, basicFilter(routes)) : menus;
};

export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();

  const allParentPath = await getAllParentPath(menus, currentPath);

  return allParentPath?.[0];
}

// Get the level 1 menu, delete children
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus();
  const routes = router.getRoutes();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  return !isBackMode() ? shallowMenuList.filter(basicFilter(routes)) : shallowMenuList;
}

// Get the children of the menu
export async function getChildrenMenus(parentPath: string) {
  const menus = await getMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent || !parent.children || !!parent?.meta?.hideChildrenInMenu) return [] as Menu[];
  const routes = router.getRoutes();

  return !isBackMode() ? filter(parent.children, basicFilter(routes)) : parent.children;
}

function basicFilter(routes: RouteRecordNormalized[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find((route) => {
      if (isUrl(menu.path)) return true;

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

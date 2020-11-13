import type { Menu, MenuModule } from '/@/router/types';
import type { RouteRecordNormalized } from 'vue-router';
import { appStore } from '/@/store/modules/app';
import { permissionStore } from '/@/store/modules/permission';
import { transformMenuModule, flatMenus, getAllParentPath } from '/@/utils/helper/menuHelper';
import { filter } from '/@/utils/helper/treeHelper';
import router from '/@/router';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { pathToRegexp } from 'path-to-regexp';
import modules from 'globby!/@/router/menus/modules/**/*.@(ts)';

const menuModules: MenuModule[] = [];

Object.keys(modules).forEach((key) => {
  menuModules.push(modules[key]);
});

// ===========================
// ==========Helper===========
// ===========================

const staticMenus: Menu[] = [];
(() => {
  menuModules.sort((a, b) => {
    return (a.orderNo || 0) - (b.orderNo || 0);
  });
  for (const menu of menuModules) {
    staticMenus.push(transformMenuModule(menu));
  }
})();

const isBackMode = () => {
  return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK;
};

async function getAsyncMenus() {
  // 前端角色控制菜单 直接取菜单文件
  if (!isBackMode()) {
    return staticMenus;
  }
  return permissionStore.getBackMenuListState;
}

// 获取深层扁平化菜单
export const getFlatMenus = async () => {
  const menus = await getAsyncMenus();

  return flatMenus(menus);
};

// 获取菜单 树级
export const getMenus = async () => {
  const menus = await getAsyncMenus();
  const routes = router.getRoutes();
  return !isBackMode() ? filter(menus, basicFilter(routes)) : menus;
};

// 获取当前路径的顶级路径
export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();
  const allParentPath = await getAllParentPath(menus, currentPath);
  return allParentPath[0];
}

// 获取1级菜单，删除children
export async function getShallowMenus() {
  const menus = await getAsyncMenus();
  const routes = router.getRoutes();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  return !isBackMode() ? shallowMenuList.filter(basicFilter(routes)) : shallowMenuList;
}

// 获取菜单的children
export async function getChildrenMenus(parentPath: string) {
  const menus = await getAsyncMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent) return [] as Menu[];
  return parent.children;
}

// 扁平化children
export async function getFlatChildrenMenus(children: Menu[]) {
  return flatMenus(children);
}

// 通用过滤方法
function basicFilter(routes: RouteRecordNormalized[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find((route) => {
      if (route.meta) {
        if (route.meta.carryParam) {
          return pathToRegexp(route.path).test(menu.path);
        }
        if (route.meta.ignoreAuth) return false;
      }
      return route.path === menu.path;
    });

    if (!matchRoute) return false;
    menu.icon = menu.icon || matchRoute.meta.icon;
    menu.meta = matchRoute.meta;
    return true;
  };
}

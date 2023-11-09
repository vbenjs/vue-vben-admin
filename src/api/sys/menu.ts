/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @description: 根据后台接口重新组装菜单
 * @author: msc
 * @created
 * @updated: 2023-05-31
 * @exports:{function} getMenuList
 */
import { getMenuListResultModel } from './model/menuModel';
import { asyncRoutes } from '/@/router/routes';
import { AppRouteRecordRaw } from '/@/router/types';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetMenuList = '/core/auth/menu/getUserMenuTree',
}

const asyncRoutesC = [...asyncRoutes]; // --> !!!使用重解构浅拷贝，防止更改源数据
const asyncRouteObj = transformRoutesToObj(asyncRoutesC);
const ignoreAuthRouteObj = transformAuthRoutesToObj(asyncRoutesC);

export const getMenuList = () => {
  return defHttp
    .get<getMenuListResultModel>({
      url: Api.GetMenuList,
      params: { sszxt: import.meta.env.VITE_GLOB_ZXTID },
    })
    .then((res) => {
      return buildRoutes(transformRoutes(res), ignoreAuthRouteObj);
    });
};

// 基于菜单的路由重装
function transformRoutes(menuListResult: getMenuListResultModel = []): AppRouteRecordRaw[] {
  if (!menuListResult.length) {
    return [];
  }
  return menuListResult.reduce((routes: AppRouteRecordRaw[], menuItem) => {
    const key = `_${menuItem.qqdz}`;
    const route = asyncRouteObj[key];
    if (route) {
      routes.push(route);
      if (menuItem.children?.length) {
        route.children = transformRoutes(menuItem.children);
      }
    }
    return routes;
  }, []);
}

// 数组拍平，reduceignoreAuthRouteObj
function transformRoutesToObj(routes: AppRouteRecordRaw[]): {
  [path: string]: AppRouteRecordRaw;
} {
  return routes.reduce<{ [path: string]: AppRouteRecordRaw }>((obj, route) => {
    if (route.children?.length) {
      Object.assign(obj, transformRoutesToObj(route.children));
    }
    const { children, ...noChildRoute } = route;
    obj[`_${route.path}`] = noChildRoute;
    return obj;
  }, {});
}

// 数组重装，返回不隐藏的数组
function transformAuthRoutesToObj(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
  return routes.reduce<AppRouteRecordRaw[]>((acc, curr) => {
    if (curr.meta?.hideMenu) {
      acc.push(curr);
    }
    if (curr.children) {
      const children = transformAuthRoutesToObj(curr.children);
      if (children.length > 0) {
        acc.push({ ...curr, children });
      }
    }
    return acc;
  }, []);
}

// 将忽视不隐藏的路由添加到源路由中
function buildRoutes(routes, ignoreAuthRouteObj) {
  for (const ignoreRoute of ignoreAuthRouteObj) {
    const route = routes.find((r) => r.path === ignoreRoute.path);
    if (route) {
      const { children } = ignoreRoute;
      route.children.push(...children);
    }
  }
  return routes;
}

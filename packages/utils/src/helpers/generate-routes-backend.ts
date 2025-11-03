import type { RouteRecordRaw } from 'vue-router';

import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
} from '@vben-core/typings';

import { cloneDeep, mapTree } from '@vben-core/shared/utils';

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options;

  try {
    const menuRoutes = await fetchMenuListAsync?.();
    if (!menuRoutes) {
      return [];
    }

    const normalizePageMap: ComponentRecordType = {};

    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }

    const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap);

    return routes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  const realRoutes = convertToRealRouting(routes);

  // debugger;
  return mapTree(realRoutes, (node) => {
    const route = node as unknown as RouteRecordRaw;
    const { component, name } = node;
    if (!name) {
      console.error('route name is required', route);
    }

    // layout转换
    if (component && layoutMap[component]) {
      route.component = layoutMap[component];
      // 页面组件转换
    } else if (component) {
      const normalizePath = normalizeViewPath(component);
      const pageKey = normalizePath.endsWith('.vue')
        ? normalizePath
        : `${normalizePath}.vue`;
      if (pageMap[pageKey]) {
        route.component = pageMap[pageKey];
      } else {
        console.error(`route component is invalid: ${pageKey}`, route);
        route.component = pageMap['/_core/fallback/not-found.vue'];
      }
    }

    return route;
  });
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;

  // 这里耦合了vben-admin的目录结构
  return viewPath.replace(/^\/views/, '');
}

// 转换成真实的路由
function convertToRealRouting(routes: RouteRecordStringComponent[]) {
  function replaceAttribute(
    data: Record<string, any>[],
    attrs: [string, string],
  ) {
    const [from, to] = attrs;
    return data.map((item) => {
      item[to] = item[from];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete item[from];

      if (Array.isArray(item.children) && item.children.length > 0) {
        item.children = replaceAttribute(item.children, attrs);
      }
      return item;
    });
  }

  function handleMoreAttribute(data: Record<string, any>) {
    const removeAttrSet = new Set([
      'authority',
      'createTime',
      'icon',
      'id',
      'openStyle',
      'parentName',
      'pid',
      'sort',
      'type',
    ]);

    const obj = cloneDeep(data);
    for (const attr of removeAttrSet) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete obj[attr];
      }
    }
    if (Array.isArray(obj.children) && obj.children.length > 0) {
      obj.children = obj.children.map((r) => handleMoreAttribute(r));
    }
    return obj;
  }

  function getRedirectPath(
    data: Record<string, any>,
    [trackProp, splitProp]: [string, string],
  ): string {
    if (!Object.prototype.hasOwnProperty.call(data, splitProp)) return '';
    if (Array.isArray(data[trackProp]) && data[trackProp].length > 0) {
      return [
        data[splitProp],
        getRedirectPath(data[trackProp][0], [trackProp, splitProp]),
      ]
        .join('/')
        .trim();
    }
    return data[splitProp].trim();
  }

  return routes.map((item) => {
    const copyItem = cloneDeep(item);
    // 替换所有路由中的 url 字段为 path，并去除多余的对象属性
    const [route] = replaceAttribute([copyItem], ['url', 'path']) as [
      Record<string, any>,
    ];

    if (route.pid === null) {
      // 处理有子菜单的根路由
      if (Array.isArray(route.children) && route.children.length > 0) {
        route.component = 'BasicLayout';
        route.redirect = getRedirectPath(route, ['children', 'path']);
        // bug: 如果是多级菜单,则二级菜单之后没有处理
        // 处理子菜单(二级菜单)的 component 和 name
        route.children = route.children.map((r) => {
          r.component = [route.path, r.path].join('/');
          if (Object.prototype.hasOwnProperty.call(r, 'children')) {
            delete r.children;
          }
          r.name = [route.path, r.path]
            .join('/')
            .replaceAll(/^\/|\/$/g, '')
            .split('/')
            .map((str: string) => str.slice(0, 1).toUpperCase() + str.slice(1))
            .join('');
          return r;
        });
      }
      // 处理没有子菜单的根路由
      else {
        route.component = route.path;
      }
    }

    // 处理根路由的 name
    route.name = route.path
      .replaceAll(/^\/|\/$/g, '')
      .split('/')
      .map((str: string) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join('');

    // tag: 需要处理掉无用的属性
    return handleMoreAttribute(route);
  });
}

export { generateRoutesByBackend };

import { RouteMeta } from '/@/router/types';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: 获取菜单接口
 */
export interface getMenuListByIdParams {
  id: number | string;
}

/**
 * @description: 获取菜单返回值
 */
export type getMenuListByIdParamsResultModel = RouteItem[];

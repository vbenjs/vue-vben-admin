import type { RouteMeta } from 'vue-router';
import { BasicFetchResult } from '@/api/model/baseModel';

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
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

export interface MenuListItem {
  id: string;
  orderNo: string;
  createTime: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
}

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export type MenuParams = {
  menuName?: string;
  status?: string;
};

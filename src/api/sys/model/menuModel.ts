import { Meta } from '@/router/types';
export interface RouteItem {
  path: string;
  component: any;
  meta: Meta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: 获取菜单接口
 */
export interface GetByUserIdParams {
  userId: number | string;
}

/**
 * @description: 获取菜单返回值
 */
export type GetMenuListByUserIdResult = RouteItem[];

/**
 * 角色code返回值
 */
export type GetAuthCodeByUserIdResult = string[];

import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

export enum ListType {
  menu = 0,
  button,
  interface,
  all = 'null',
}

export interface MetaInfo {
  authority: null;
  icon: string;
  title: string;
}

export interface MenuData {
  id: number;
  pid: null | number;
  name: string;
  url: string;
  type: 0 | 1 | 2;
  icon: string;
  authority: null | string;
  sort: number;
  createTime: null | string;
  parentName: null | string;
  meta: MetaInfo;
  children: [] | MenuData[];
}

/**
 * 获取用户的菜单列表
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>(`sys:menu/list`, {
    params: {
      type: ListType.Menu,
    },
  });
}

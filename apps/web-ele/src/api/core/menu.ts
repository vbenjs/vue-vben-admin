import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

enum ListType {
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
 * 获取不同类型的菜单列表
 */
export async function getDiffTypeMenuListApi(type: keyof typeof ListType) {
  return requestClient.get<MenuData[]>(`sys:menu/list`, {
    params: {
      type: ListType[type],
    },
  });
}

/**
 * 获取用户菜单导航
 */
export async function getMenuNavApi() {
  return requestClient.get<RouteRecordStringComponent[]>(`sys:menu/nav`);
}

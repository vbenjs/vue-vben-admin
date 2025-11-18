import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

enum ListType {
  menu = 0,
  button,
  interface,
  all = 'null',
}

/**
 * 获取不同类型的菜单列表
 */
export async function getDiffTypeMenuListApi(type: keyof typeof ListType) {
  return requestClient.get<RouteRecordStringComponent[]>(`sys:menu/list`, {
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

import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

enum ListType {
  Menu = 0,
  Btn,
  Interface,
  All = 'null',
}

/**
 * 获取用户的菜单列表
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('sys:menu/list', {
    data: {
      type: ListType.Menu,
    },
  });
}

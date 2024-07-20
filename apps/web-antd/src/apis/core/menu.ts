import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/forward';

/**
 * 获取用户所有菜单
 */
export async function getAllMenus() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

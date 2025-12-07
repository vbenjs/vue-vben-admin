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
      type: ListType[type] === 'null' ? undefined : ListType[type],
    },
  });
}

/**
 * 获取用户菜单导航
 */
export async function getMenuNavApi() {
  return requestClient.get<RouteRecordStringComponent[]>(`sys:menu/nav`);
}

/**
 * 添加菜单接口
 * @param data 添加菜单的参数
 * @returns
 */
export async function appendMenuApi(
  data: Pick<MenuData, 'meta' | 'name' | 'pid' | 'type' | 'url'>,
) {
  return requestClient.post(`sys:menu`, data);
}

/**
 * 更新菜单的接口
 * @param data 更新菜单的参数
 * @returns
 */
export async function updateMenuApi(
  data: Partial<Pick<MenuData, 'meta' | 'name' | 'pid' | 'type' | 'url'>> & {
    id: number;
  },
) {
  return requestClient.put(`sys:menu`, data);
}

/**
 * 删除菜单的接口
 * @param id 菜单id
 * @returns
 */
export async function deleteMenuApi(id: number) {
  return requestClient.delete(`sys:menu`, {
    params: {
      id,
    },
  });
}

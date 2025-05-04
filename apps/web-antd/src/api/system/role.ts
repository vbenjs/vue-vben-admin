import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace RoleApi {
  export interface RoleItem {
    id: number;
    name: string;
    value: string;
    createdAt: string;
    updatedAt: string;
  }
}
/**
 * 获取角色列表
 */
export async function getRoleListApi(params: Api.BasicParams) {
  return requestClient.get<RoleApi.RoleItem[]>('/role/list', { params });
}

/**
 * 获取角色详情
 */
export async function getRoleByIdApi(id: number | string) {
  return requestClient.get<RoleApi.RoleItem>(`/role/${id}`);
}

/**
 * 创建角色
 */
export async function createRoleApi(data: RoleApi.RoleItem) {
  return requestClient.post<{ id: number }>('/role', data);
}

/**
 * 更新角色
 */
export async function updateRoleApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/role/${id}`, data);
}

/**
 * 删除角色
 */

export async function deleteRoleApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/role/${id}`);
}

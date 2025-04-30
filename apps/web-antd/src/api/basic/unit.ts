import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace UnitApi {
  export interface UnitAllItem {
    id: number;
    name: string;
  }
  export interface UnitItem {
    id: number;
    name: string;
    sort: number;
    createdAt: string;
    updatedAt: string;
  }
}
/**
 * 获取单位列表
 */
export async function getUnitListApi(params: Api.BasicParams) {
  return requestClient.get<UnitApi.UnitItem[]>('/unit/list', { params });
}

/**
 * 获取单位详情
 */
export async function getUnitByIdApi(id: number | string) {
  return requestClient.get<UnitApi.UnitItem>(`/unit/${id}`);
}

/**
 * 创建单位
 */
export async function createUnitApi(data: UnitApi.UnitItem) {
  return requestClient.post<{ id: number }>('/unit', data);
}

/**
 * 更新单位
 */
export async function updateUnitApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/unit/${id}`, data);
}

/**
 * 删除单位
 */

export async function deleteUnitApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/unit/${id}`);
}

/**
 * 获取单位列表
 */
export async function getUnitAllApi() {
  return requestClient.get<UnitApi.UnitAllItem[]>('/unit/all');
}

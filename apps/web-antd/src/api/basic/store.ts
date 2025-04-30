import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace StoreApi {
  export interface StoreAllItem {
    id: number;
    name: string;
    status: 0 | 1;
  }
  export interface StoreItem {
    id: number;
    name: string;
    phone: string;
    contact: string;
    status: 0 | 1;
    isDefault: 0 | 1;
    address: string;
    desc: string;
    createdAt: string;
    updatedAt: string;
  }
}
/**
 * 获取仓库简单列表
 */
export async function getStoreAllApi() {
  return requestClient.get<StoreApi.StoreItem[]>('/store/all');
}
/**
 * 获取仓库列表
 */
export async function getStoreListApi(params: Api.BasicParams) {
  return requestClient.get<StoreApi.StoreItem[]>('/store/list', { params });
}

/**
 * 获取仓库详情
 */
export async function getStoreByIdApi(id: number | string) {
  return requestClient.get<StoreApi.StoreItem>(`/store/${id}`);
}

/**
 * 创建仓库
 */
export async function createStoreApi(data: StoreApi.StoreItem) {
  return requestClient.post<{ id: number }>('/store', data);
}

/**
 * 更新仓库
 */
export async function updateStoreApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/store/${id}`, data);
}

/**
 * 删除仓库
 */

export async function deleteStoreApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/store/${id}`);
}

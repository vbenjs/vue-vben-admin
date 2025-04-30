import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace BrandApi {
  export interface BrandAllItem {
    id: number;
    name: string;
  }
  export interface BrandItem {
    id: number;
    name: string;
    sort: number;
    createdAt: string;
    updatedAt: string;
  }
}
/**
 * 获取品牌列表
 */
export async function getBrandListApi(params: Api.BasicParams) {
  return requestClient.get<BrandApi.BrandItem[]>('/brand/list', { params });
}

/**
 * 获取品牌详情
 */
export async function getBrandByIdApi(id: number | string) {
  return requestClient.get<BrandApi.BrandItem>(`/brand/${id}`);
}

/**
 * 创建品牌
 */
export async function createBrandApi(data: BrandApi.BrandItem) {
  return requestClient.post<{ id: number }>('/brand', data);
}

/**
 * 更新品牌
 */
export async function updateBrandApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/brand/${id}`, data);
}

/**
 * 删除品牌
 */

export async function deleteBrandApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/brand/${id}`);
}

/**
 * 获取品牌列表
 */
export async function getBrandAllApi() {
  return requestClient.get<BrandApi.BrandAllItem[]>('/brand/all');
}

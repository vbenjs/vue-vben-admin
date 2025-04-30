import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace ColorApi {
  export interface ColorAllItem {
    id: number;
    name: string;
  }
  export interface ColorItem {
    id: number;
    name: string;
    sort: number;
    createdAt: string;
    updatedAt: string;
  }
}
/**
 * 获取颜色列表
 */
export async function getColorListApi(params: Api.BasicParams) {
  return requestClient.get<ColorApi.ColorItem[]>('/color/list', { params });
}

/**
 * 获取颜色详情
 */
export async function getColorByIdApi(id: number | string) {
  return requestClient.get<ColorApi.ColorItem>(`/color/${id}`);
}

/**
 * 创建颜色
 */
export async function createColorApi(data: ColorApi.ColorItem) {
  return requestClient.post<{ id: number }>('/color', data);
}

/**
 * 更新颜色
 */
export async function updateColorApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/color/${id}`, data);
}

/**
 * 删除颜色
 */

export async function deleteColorApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/color/${id}`);
}

/**
 * 获取颜色列表
 */
export async function getColorAllApi() {
  return requestClient.get<ColorApi.ColorAllItem[]>('/color/all');
}

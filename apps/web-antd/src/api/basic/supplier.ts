import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace SupplierApi {
  export interface SupplierAllItem {
    id: number;
    name: string;
    status: 0 | 1;
  }
  export interface SupplierItem {
    id: number;
    name: string;
    pinyin: string;
    phone: string;
    contact: string;
    company: string;
    tax_no: string;
    bank_name: string;
    bank_account: string;
    bank_holder: string;
    bank_address: string;
    address: string;
    status: 0 | 1;
    is_default: 0 | 1;
    initial_balance: number;
    created_at: string;
    updated_at: string;
  }
}
/**
 * 获取供货商简单列表
 */
export async function getSupplierAllApi() {
  return requestClient.get<SupplierApi.SupplierItem[]>('/supplier/all');
}
/**
 * 获取供货商列表
 */
export async function getSupplierListApi(params: Api.BasicParams) {
  return requestClient.get<SupplierApi.SupplierItem[]>('/supplier/list', {
    params,
  });
}

/**
 * 获取供货商详情
 */
export async function getSupplierByIdApi(id: number | string) {
  return requestClient.get<SupplierApi.SupplierItem>(`/supplier/${id}`);
}

/**
 * 创建供货商
 */
export async function createSupplierApi(data: SupplierApi.SupplierItem) {
  return requestClient.post<{ id: number }>('/supplier', data);
}

/**
 * 更新供货商
 */
export async function updateSupplierApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/supplier/${id}`, data);
}

/**
 * 删除供货商
 */

export async function deleteSupplierApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/supplier/${id}`);
}

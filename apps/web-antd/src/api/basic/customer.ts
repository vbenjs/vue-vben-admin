import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace CustomerApi {
  export interface CustomerAllItem {
    id: number;
    name: string;
    status: 0 | 1;
  }
  export interface CustomerItem {
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
 * 获取客户简单列表
 */
export async function getCustomerAllApi() {
  return requestClient.get<CustomerApi.CustomerItem[]>('/customer/all');
}
/**
 * 获取客户列表
 */
export async function getCustomerListApi(params: Api.BasicParams) {
  return requestClient.get<CustomerApi.CustomerItem[]>('/customer/list', {
    params,
  });
}

/**
 * 获取客户详情
 */
export async function getCustomerByIdApi(id: number | string) {
  return requestClient.get<CustomerApi.CustomerItem>(`/customer/${id}`);
}

/**
 * 创建客户
 */
export async function createCustomerApi(data: CustomerApi.CustomerItem) {
  return requestClient.post<{ id: number }>('/customer', data);
}

/**
 * 更新客户
 */
export async function updateCustomerApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/customer/${id}`, data);
}

/**
 * 删除客户
 */

export async function deleteCustomerApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/customer/${id}`);
}

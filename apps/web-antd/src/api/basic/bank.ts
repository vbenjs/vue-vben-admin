import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

type BankRecordParams = Api.BasicParams & {
  bankId?: number;
  endDate: Date | string;
  startDate: Date | string;
};
export namespace BankApi {
  export interface BankAllItem {
    id: number;
    name: string;
    status: 0 | 1;
  }
  export interface BankItem {
    id: number;
    name: string;
    holder: string;
    account: string;
    address: string;
    balance: number;
    status: 0 | 1;
    isDefault: 0 | 1;
    createdAt: string;
    updatedAt: string;
  }
  export interface BankRecordItem {
    id: number;
    bankId: number;
    bankName: string;
    busTypeName: string;
    orderNo: string;
    amount: number;
    balance: number;
    createdAt: string;
  }
}
/**
 * 获取银行简单列表
 */
export async function getBankAllApi() {
  return requestClient.get<BankApi.BankItem[]>('/bank/all');
}
/**
 * 获取银行列表
 */
export async function getBankListApi(params: Api.BasicParams) {
  return requestClient.get<BankApi.BankItem[]>('/bank/list', { params });
}

/**
 * 获取银行详情
 */
export async function getBankByIdApi(id: number | string) {
  return requestClient.get<BankApi.BankItem>(`/bank/${id}`);
}

/**
 * 创建银行
 */
export async function createBankApi(data: BankApi.BankItem) {
  return requestClient.post<{ id: number }>('/bank', data);
}

/**
 * 更新银行
 */
export async function updateBankApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/bank/${id}`, data);
}

/**
 * 删除银行
 */

export async function deleteBankApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/bank/${id}`);
}

/** 获取银行流水 */
export async function getBankRecordListApi(params: BankRecordParams) {
  return requestClient.get<BankApi.BankRecordItem[]>('/bank/record', {
    params,
  });
}

import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace PurchaseApi {
  export interface PurchaseListItem {
    id: number;
    purchaseOrderNo: string;
    purchaseSupplierName: string;
    purchasePurchaseName: string;
    purchaseStoreName: string;
    purchaseHandlerName: string;
    purchaseTradeAt: string;
    purchasePayableAmount: number;
    purchasePaidAmount: number;
    purchaseArrearsAmount: number;
    purchaseDiscountAmount: number;
    purchaseBusTypeName: string;
    purchaseAuditorBy: string;
    purchaseCreatedBy: string;
    purchaseUpdatedBy: string;
    purchaseCreatedAt: string;
    purchaseUpdatedAt: string;
    purchaseAuditorAt: string;
    purchaseDesc: string;
    purchaseStatus: number;
  }
}
/**
 * 获取采购入库列表
 */
export async function getPurchaseListApi(params: Api.BasicParams) {
  return requestClient.get<PurchaseApi.PurchaseListItem[]>('/purchase/list', {
    params,
  });
}

/**
 * 初始化采购入库
 */
export async function getPurchaseInitApi() {
  return requestClient.get(`/purchase/init`);
}
/**
 * 创建采购入库
 */
export async function createPurchaseApi(data: PurchaseApi.PurchaseItem) {
  return requestClient.post('/purchase', data);
}
export async function getPurchaseByIdApi(id: number | string) {
  return requestClient.get<PurchaseApi.PurchaseItem>(`/purchase/${id}`);
}
export async function auditByIdApi({ id }) {
  return requestClient.put(`/purchase/audit/${id}`);
}

export async function unauditByIdApi({ id }) {
  return requestClient.put(`/purchase/unaudit/${id}`);
}
export async function deletePurchaseApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/purchase/${id}`);
}
export async function updatePurchaseApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/purchase/${id}`, data);
}

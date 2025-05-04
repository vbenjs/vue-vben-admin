import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace PurchaseApi {
  export interface PurchaseListItem {
    id: number;
    purchaseOrderNo: string;
    purchaseSupplierName: string;
    purchaseBankName: string;
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

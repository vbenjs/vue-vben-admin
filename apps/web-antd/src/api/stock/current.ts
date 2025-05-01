import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';
export namespace CurrentApi {
  export interface CurrentItem {
    id: number;
    storeName: string;
    productId: number;
    productName: string;
    productPinyin: string;
    productBarcode: string;
    productUnit: string;
    productSpec: string;
    productColor: string;
    productMaxPrice: number;
    productMinPrice: number;
    productMaxLimit: number;
    productMinLimit: number;
    productSalePrice: number;
    productPurchasePrice: number;
    productIsVirtual: 0 | 1; // 建议改为 boolean 类型更合适
    productStatus: 0 | 1; // 字段名拼写错误，建议修正为 productStatus
    num: number;
    price: number;
    totalPrice: number;
    createdAt: string; // 建议使用 Date 类型更合适
    updatedAt: string; // 建议使用 Date 类型更合适
  }
}
export async function getCurrentListApi(params: Api.BasicParams) {
  return requestClient.get<CurrentApi.CurrentItem[]>('/stock/current', {
    params,
  });
}

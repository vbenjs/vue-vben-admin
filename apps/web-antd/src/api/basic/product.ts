import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

type ProductRecordParams = Api.BasicParams & {
  endDate: Date | string;
  startDate: Date | string;
  storeId?: number;
};
export namespace ProductApi {
  export interface ProductAllItem {
    id: number;
    name: string;
    status: 0 | 1;
  }
  export interface ProductItem {
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
  export interface ProductRecordItem {
    id: number;
    storeName: string;
    productId: number;
    productName: string;
    busTypeName: string;
    orderNo: string;
    num: number;
    price: number;
    totalPrice: number;
    createdAt: string;
  }
}
/**
 * 获取产品简单列表
 */
export async function getProductAllApi() {
  return requestClient.get<ProductApi.ProductItem[]>('/product/all');
}
/**
 * 获取产品列表
 */
export async function getProductListApi(params: Api.BasicParams) {
  return requestClient.get<ProductApi.ProductItem[]>('/product/list', {
    params,
  });
}

/**
 * 获取产品详情
 */
export async function getProductByIdApi(id: number | string) {
  return requestClient.get<ProductApi.ProductItem>(`/product/${id}`);
}

/**
 * 创建产品
 */
export async function createProductApi(data: ProductApi.ProductItem) {
  return requestClient.post<{ id: number }>('/product', data);
}

/**
 * 更新产品
 */
export async function updateProductApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/product/${id}`, data);
}

/**
 * 删除产品
 */

export async function deleteProductApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/product/${id}`);
}

/** 获取产品流水 */
export async function getProductRecordListApi(params: ProductRecordParams) {
  return requestClient.get<ProductApi.ProductRecordItem[]>('/product/record', {
    params,
  });
}

import type { DictItem } from '@vben/stores';

import { requestClient } from '#/api/request';

/**
 * 按编码获取字典数据
 * @param code 字典编码
 */
export async function getDictApi(code: string) {
  return requestClient.get<DictItem[]>('/dict/data', {
    params: { code },
  });
}

/**
 * 获取全部字典数据
 */
export async function getAllDictsApi() {
  return requestClient.get<Record<string, DictItem[]>>('/dict/all');
}

/**
 * 获取字典版本号
 */
export async function getDictVersionApi() {
  return requestClient.get<number>('/dict/version');
}

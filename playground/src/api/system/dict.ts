import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  export interface SystemDictType {
    [key: string]: any;
    code: string;
    createTime?: string;
    id: string;
    name: string;
    remark?: string;
    status: 0 | 1;
  }

  export interface SystemDictData {
    [key: string]: any;
    color?: string;
    createTime?: string;
    dictCode: string;
    id: string;
    label: string;
    remark?: string;
    sort: number;
    status: 0 | 1;
    value: number | string;
  }
}

/**
 * 获取字典类型列表
 */
async function getDictTypeList(params: Recordable<any>) {
  return requestClient.get<{
    items: SystemDictApi.SystemDictType[];
    total: number;
  }>('/system/dict/type/list', { params });
}

/**
 * 创建字典类型
 * @param data 字典类型数据
 */
async function createDictType(
  data: Omit<SystemDictApi.SystemDictType, 'createTime' | 'id'>,
) {
  return requestClient.post('/system/dict/type', data);
}

/**
 * 更新字典类型
 * @param id 字典类型 ID
 * @param data 字典类型数据
 */
async function updateDictType(
  id: string,
  data: Omit<SystemDictApi.SystemDictType, 'createTime' | 'id'>,
) {
  return requestClient.put(`/system/dict/type/${id}`, data);
}

/**
 * 删除字典类型
 * @param id 字典类型 ID
 */
async function deleteDictType(id: string) {
  return requestClient.delete(`/system/dict/type/${id}`);
}

/**
 * 字典编码是否已存在
 * @param code 字典编码
 * @param id 当前编辑的字典类型 ID（可选）
 */
async function isDictCodeExists(
  code: string,
  id?: SystemDictApi.SystemDictType['id'],
) {
  return requestClient.get<boolean>('/system/dict/type/code-exists', {
    params: { code, id },
  });
}

/**
 * 获取字典数据列表
 */
async function getDictDataList(params: Recordable<any>) {
  return requestClient.get<{
    items: SystemDictApi.SystemDictData[];
    total: number;
  }>('/system/dict/data/list', { params });
}

/**
 * 创建字典数据
 * @param data 字典数据
 */
async function createDictData(
  data: Omit<SystemDictApi.SystemDictData, 'createTime' | 'id'>,
) {
  return requestClient.post('/system/dict/data', data);
}

/**
 * 更新字典数据
 * @param id 字典数据 ID
 * @param data 字典数据
 */
async function updateDictData(
  id: string,
  data: Omit<SystemDictApi.SystemDictData, 'createTime' | 'id'>,
) {
  return requestClient.put(`/system/dict/data/${id}`, data);
}

/**
 * 删除字典数据
 * @param id 字典数据 ID
 */
async function deleteDictData(id: string) {
  return requestClient.delete(`/system/dict/data/${id}`);
}

export {
  createDictData,
  createDictType,
  deleteDictData,
  deleteDictType,
  getDictDataList,
  getDictTypeList,
  isDictCodeExists,
  updateDictData,
  updateDictType,
};

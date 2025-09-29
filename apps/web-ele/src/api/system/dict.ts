import { requestClient } from '#/api/request';

export namespace DictApi {
  /** 字典类型树查询参数 */
  export type GetDictTypeTreeRequest = Record<string, never>;

  /** 字典类型树响应数据 */
  export interface DictTypeTreeResponse {
    dictTypeId: number;
    dictTypeCode: string;
    dictTypeName: string;
    parentDictTypeCode?: string;
    isSystem: string;
    sort?: number;
    hasChildren: boolean;
    children?: DictTypeTreeResponse[];
  }

  /** 创建字典类型请求 */
  export interface CreateDictTypeRequest {
    dictTypeCode: string;
    dictTypeName: string;
    sort?: number;
    parentDictTypeCode?: string;
  }

  /** 更新字典类型请求 */
  export interface UpdateDictTypeRequest {
    dictTypeId: number;
    dictTypeName: string;
    sort?: number;
    parentDictTypeCode?: string;
  }

  /** 删除字典类型请求 */
  export interface DeleteDictTypeRequest {
    dictTypeId: number;
  }

  /** 字典基础信息列表查询参数 */
  export interface GetDictListRequest {
    pageNum?: number;
    pageSize?: number;
    dictCode?: string;
    dictName?: string;
    dictTypeCode?: string;
    dictStructType?: string;
    dictType?: string;
    isSystem?: string;
    dictStatus?: string;
  }

  /** 字典基础信息列表响应数据 */
  export interface DictListResponse {
    dictId: number;
    dictCode: string;
    dictName: string;
    dictStructType: string;
    dictType: string;
    dictTypeCode: string;
    isSystem: string;
    dictStatus: string;
    createdTime: string;
    updatedTime: string;
  }

  /** 字典基础信息详情请求 */
  export interface GetDictDetailRequest {
    dictId: number;
  }

  /** 字典基础信息详情响应 */
  export interface DictDetailResponse {
    dictId: number;
    dictCode: string;
    dictName: string;
    dictStructType: string;
    dictType: string;
    dictTypeCode: string;
    isSystem: string;
    dictStatus: string;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    updatedBy: number;
  }

  /** 创建字典基础信息请求 */
  export interface CreateDictRequest {
    dictCode: string;
    dictName: string;
    dictStructType: string;
    dictType: string;
    dictTypeCode: string;
    dictStatus?: string;
  }

  /** 更新字典基础信息请求 */
  export interface UpdateDictRequest {
    dictId: number;
    dictName: string;
    dictStructType: string;
    dictType: string;
    dictTypeCode: string;
    dictStatus: string;
  }

  /** 删除字典基础信息请求 */
  export interface DeleteDictRequest {
    dictId: number;
  }

  /** 批量更新字典基础信息请求 */
  export interface BatchUpdateDictRequest {
    dictIds: number[];
    operation: string;
  }

  /** 分页结果 */
  export interface PageResult<T> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
  }

  /** 字典类型详情请求 */
  export interface GetDictTypeDetailRequest {
    dictTypeId: number;
  }

  /** 字典类型详情响应 */
  export interface DictTypeDetailResponse {
    dictTypeId: number;
    dictTypeCode: string;
    dictTypeName: string;
    isSystem: string;
    sort?: number;
    parentDictTypeCode?: string;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    updatedBy: number;
  }

  // ======== 字典值相关接口 ========

  /** 字典值列表查询参数 */
  export interface GetDictValueListRequest {
    dictCode: string;
    dictLabel?: string;
    parentId?: number;
  }

  /** 字典值列表响应数据 */
  export interface DictValueListResponse {
    dictValueId: number;
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    sort: number;
    parentId?: number;
    createdTime: string;
    updatedTime: string;
  }

  /** 字典值树查询参数 */
  export interface GetDictValueTreeRequest {
    dictCode: string;
    dictLabel?: string;
    parentId?: number;
  }

  /** 字典值树响应数据 */
  export interface DictValueTreeResponse {
    dictValueId: number;
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    sort: number;
    parentId?: number;
    createdTime: string;
    updatedTime: string;
    children?: DictValueTreeResponse[];
    hasChildren: boolean;
  }

  /** 字典值详情请求 */
  export interface GetDictValueDetailRequest {
    dictValueId: number;
  }

  /** 字典值详情响应 */
  export interface DictValueDetailResponse {
    dictValueId: number;
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    sort: number;
    parentId?: number;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    updatedBy: number;
  }

  /** 创建字典值请求 */
  export interface CreateDictValueRequest {
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    sort?: number;
    parentId?: number;
  }

  /** 更新字典值请求 */
  export interface UpdateDictValueRequest {
    dictValueId: number;
    dictLabel: string;
    dictValue: string;
    sort?: number;
    parentId?: number;
  }

  /** 删除字典值请求 */
  export interface DeleteDictValueRequest {
    dictValueId: number;
  }

  /** 通用响应 */
  export interface CommonResult<T = any> {
    code: string;
    message: string;
    data?: T;
  }
}

// 字典类型相关API

/**
 * 获取字典类型树
 */
export async function getDictTypeTreeApi(data: DictApi.GetDictTypeTreeRequest) {
  return requestClient.get<DictApi.DictTypeTreeResponse[]>(
    '/auth/dict-type/tree',
    { params: data },
  );
}

/**
 * 创建字典类型
 */
export async function createDictTypeApi(data: DictApi.CreateDictTypeRequest) {
  return requestClient.post<DictApi.CommonResult>(
    '/auth/dict-type/create',
    data,
  );
}

/**
 * 更新字典类型
 */
export async function updateDictTypeApi(data: DictApi.UpdateDictTypeRequest) {
  return requestClient.put<DictApi.CommonResult>(
    '/auth/dict-type/update',
    data,
  );
}

/**
 * 获取字典类型详情
 */
export async function getDictTypeDetailApi(
  data: DictApi.GetDictTypeDetailRequest,
) {
  return requestClient.get<DictApi.DictTypeDetailResponse>(
    '/auth/dict-type/detail',
    { params: data },
  );
}

/**
 * 删除字典类型
 */
export async function deleteDictTypeApi(data: DictApi.DeleteDictTypeRequest) {
  return requestClient.delete<DictApi.CommonResult>('/auth/dict-type/delete', {
    data,
  });
}

// 字典基础信息相关API

/**
 * 获取字典基础信息列表
 */
export async function getDictListApi(data: DictApi.GetDictListRequest) {
  return requestClient.get<DictApi.PageResult<DictApi.DictListResponse>>(
    '/auth/dict/list',
    { params: data },
  );
}

/**
 * 获取字典基础信息详情
 */
export async function getDictDetailApi(data: DictApi.GetDictDetailRequest) {
  return requestClient.get<DictApi.DictDetailResponse>('/auth/dict/detail', {
    params: data,
  });
}

/**
 * 创建字典基础信息
 */
export async function createDictApi(data: DictApi.CreateDictRequest) {
  return requestClient.post<DictApi.CommonResult>('/auth/dict/create', data);
}

/**
 * 更新字典基础信息
 */
export async function updateDictApi(data: DictApi.UpdateDictRequest) {
  return requestClient.put<DictApi.CommonResult>('/auth/dict/update', data);
}

/**
 * 删除字典基础信息
 */
export async function deleteDictApi(data: DictApi.DeleteDictRequest) {
  return requestClient.delete<DictApi.CommonResult>('/auth/dict/delete', {
    data,
  });
}

/**
 * 批量更新字典基础信息
 */
export async function batchUpdateDictApi(data: DictApi.BatchUpdateDictRequest) {
  return requestClient.post<DictApi.CommonResult>(
    '/auth/dict/batch-update',
    data,
  );
}

// ======== 字典值相关API ========

/**
 * 获取字典值列表
 */
export async function getDictValueListApi(
  data: DictApi.GetDictValueListRequest,
) {
  return requestClient.get<DictApi.DictValueListResponse[]>(
    '/auth/dict-value/list',
    { params: data },
  );
}

/**
 * 获取字典值树
 */
export async function getDictValueTreeApi(
  data: DictApi.GetDictValueTreeRequest,
) {
  return requestClient.get<DictApi.DictValueTreeResponse[]>(
    '/auth/dict-value/tree',
    { params: data },
  );
}

/**
 * 获取字典值详情
 */
export async function getDictValueDetailApi(
  data: DictApi.GetDictValueDetailRequest,
) {
  return requestClient.get<DictApi.DictValueDetailResponse>(
    '/auth/dict-value/detail',
    { params: data },
  );
}

/**
 * 创建字典值
 */
export async function createDictValueApi(data: DictApi.CreateDictValueRequest) {
  return requestClient.post<DictApi.CommonResult>(
    '/auth/dict-value/create',
    data,
  );
}

/**
 * 更新字典值
 */
export async function updateDictValueApi(data: DictApi.UpdateDictValueRequest) {
  return requestClient.put<DictApi.CommonResult>(
    '/auth/dict-value/update',
    data,
  );
}

/**
 * 删除字典值
 */
export async function deleteDictValueApi(data: DictApi.DeleteDictValueRequest) {
  return requestClient.delete<DictApi.CommonResult>('/auth/dict-value/delete', {
    data,
  });
}

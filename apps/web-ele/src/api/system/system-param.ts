import { requestClient } from '#/api/request';

export namespace SystemParamApi {
  /** 系统参数列表查询参数 */
  export interface GetSystemParamListRequest {
    pageNum?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: string;
    keyword?: string;
    paramName?: string;
    paramCode?: string;
    paramType?: string;
    isSystem?: string;
  }

  /** 系统参数列表响应数据 */
  export interface SystemParamListResponse {
    paramId: number;
    paramCode: string;
    paramName: string;
    paramValue: string;
    paramDesc?: string;
    paramType: string;
    isSystem: string;
    createdTime: string;
    updatedTime: string;
  }

  /** 创建系统参数请求 */
  export interface CreateSystemParamRequest {
    paramCode: string;
    paramName: string;
    paramValue: string;
    paramDesc?: string;
    paramType: string;
    isSystem: string;
  }

  /** 更新系统参数请求 */
  export interface UpdateSystemParamRequest {
    paramId: number;
    paramName: string;
    paramValue: string;
    paramDesc?: string;
    paramType: string;
    isSystem: string;
  }

  /** 删除系统参数请求 */
  export interface DeleteSystemParamRequest {
    paramId: number;
  }

  /** 系统参数详情请求 */
  export interface GetSystemParamDetailRequest {
    paramId: number;
  }

  /** 系统参数详情响应数据 */
  export interface SystemParamDetailResponse {
    paramId: number;
    paramCode: string;
    paramName: string;
    paramValue: string;
    paramDesc?: string;
    paramType: string;
    isSystem: string;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    updatedBy: number;
  }

  /** 分页结果 */
  export interface PageResult<T> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
  }

  /** 通用响应 */
  export interface CommonResult<T = any> {
    code: string;
    message: string;
    data?: T;
  }
}

/**
 * 获取系统参数列表
 */
export async function getSystemParamListApi(
  data: SystemParamApi.GetSystemParamListRequest,
) {
  return requestClient.get<
    SystemParamApi.PageResult<SystemParamApi.SystemParamListResponse>
  >('/auth/system-param/list', { params: data });
}

/**
 * 创建系统参数
 */
export async function createSystemParamApi(
  data: SystemParamApi.CreateSystemParamRequest,
) {
  return requestClient.post<SystemParamApi.CommonResult>(
    '/auth/system-param/create',
    data,
  );
}

/**
 * 更新系统参数
 */
export async function updateSystemParamApi(
  data: SystemParamApi.UpdateSystemParamRequest,
) {
  return requestClient.put<SystemParamApi.CommonResult>(
    '/auth/system-param/update',
    data,
  );
}

/**
 * 删除系统参数
 */
export async function deleteSystemParamApi(
  data: SystemParamApi.DeleteSystemParamRequest,
) {
  return requestClient.delete<SystemParamApi.CommonResult>(
    '/auth/system-param/delete',
    { data },
  );
}

/**
 * 获取系统参数详情
 */
export async function getSystemParamDetailApi(
  data: SystemParamApi.GetSystemParamDetailRequest,
) {
  return requestClient.get<SystemParamApi.SystemParamDetailResponse>(
    '/auth/system-param/detail',
    { params: data },
  );
}

/**
 * 刷新参数缓存
 */
export async function refreshSystemParamCacheApi() {
  return requestClient.post<SystemParamApi.CommonResult>(
    '/auth/system-param/refresh-cache',
  );
}

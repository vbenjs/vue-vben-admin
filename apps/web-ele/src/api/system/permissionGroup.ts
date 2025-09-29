import { requestClient } from '#/api/request';

export namespace PermissionGroupApi {
  /** 权限组列表响应数据 */
  export interface PermGroupListResponse {
    permGroupId: number; // 权限组ID
    permGroupCode: string; // 权限组编码
    permGroupName: string; // 权限组名称
    permGroupDesc?: string; // 权限组描述
    permCount: number; // 关联权限数量
    createdBy: number; // 创建人ID
    createdTime: string; // 创建时间
    updatedBy: number; // 更新人ID
    updatedTime: string; // 更新时间
  }

  /** 权限组详情请求 */
  export interface PermGroupDetailRequest {
    permGroupId: number;
  }

  /** 权限组详情响应 */
  export interface PermGroupDetailResponse {
    permGroupId: number; // 权限组ID
    permGroupCode: string; // 权限组编码
    permGroupName: string; // 权限组名称
    permGroupDesc?: string; // 权限组描述
    createdBy: number; // 创建人ID
    createdTime: string; // 创建时间
    updatedBy: number; // 更新人ID
    updatedTime: string; // 更新时间
  }

  /** 创建权限组请求 */
  export interface CreatePermGroupRequest {
    permGroupCode: string; // 权限组编码（必填，2-64字符，唯一）
    permGroupName: string; // 权限组名称（必填，2-64字符，唯一）
    permGroupDesc?: string; // 权限组描述（可选，最多255字符）
    permGroupSort?: number;
  }

  /** 更新权限组请求 */
  export interface UpdatePermGroupRequest {
    permGroupId: number; // 权限组ID（必填）
    permGroupCode: string; // 权限组编码（必填，2-64字符）
    permGroupName: string; // 权限组名称（必填，2-64字符）
    permGroupDesc?: string; // 权限组描述（可选，最多255字符）
    permGroupSort?: number;
  }

  /** 删除权限组请求 */
  export interface DeletePermGroupRequest {
    permGroupId: number;
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
 * 获取权限组列表
 */
export async function getPermGroupListApi() {
  return requestClient.get<PermissionGroupApi.PermGroupListResponse[]>(
    '/auth/permgroup/listAll',
  );
}

/**
 * 获取权限组详情
 */
export async function getPermGroupDetailApi(
  data: PermissionGroupApi.PermGroupDetailRequest,
) {
  return requestClient.get<PermissionGroupApi.PermGroupDetailResponse>(
    '/auth/permgroup/detail',
    { params: data },
  );
}

/**
 * 创建权限组
 */
export async function createPermGroupApi(
  data: PermissionGroupApi.CreatePermGroupRequest,
) {
  return requestClient.post<PermissionGroupApi.CommonResult>(
    '/auth/permgroup/create',
    data,
  );
}

/**
 * 更新权限组
 */
export async function updatePermGroupApi(
  data: PermissionGroupApi.UpdatePermGroupRequest,
) {
  return requestClient.post<PermissionGroupApi.CommonResult>(
    '/auth/permgroup/update',
    data,
  );
}

/**
 * 删除权限组
 */
export async function deletePermGroupApi(
  data: PermissionGroupApi.DeletePermGroupRequest,
) {
  return requestClient.post<PermissionGroupApi.CommonResult>(
    '/auth/permgroup/delete',
    data,
  );
}

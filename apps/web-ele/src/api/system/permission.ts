import { requestClient } from '#/api/request';

export namespace PermissionApi {
  /** 权限列表查询参数 */
  export interface GetPermListRequest {
    pageNum?: number;
    pageSize?: number;
    keyword?: string;
    permType?: string;
    serviceModule?: string;
    permStatus?: string;
    permGroupCode?: string; // 权限组编码过滤
  }

  /** 权限列表响应数据 */
  export interface PermListResponse {
    permId: number; // 对应数据库PERM_ID
    service: string; // 对应数据库SERVICE (所属服务)
    permName: string; // 对应数据库PERM_NAME (权限名称)
    permDesc?: string; // 对应数据库PERM_DESC (权限说明)
    permPrefix: string; // 对应数据库PERM_PREFIX (权限前缀)
    permPath: string; // 对应数据库PERM_PATH (权限路径)
    permType: string; // 对应数据库PERM_TYPE (权限类型)
    permStatus: string; // 对应数据库STATUS (权限状态)
    isSystem: boolean; // 对应数据库IS_SYSTEM (是否系统权限)
    permMethod: string; // 对应数据库PERM_METHOD (权限方法)
    permGroupCode?: string; // 对应数据库PERM_GROUP_CODE (权限组编码)
    createdTime: string; // 对应数据库CREATED_TIME
    updatedTime: string; // 对应数据库UPDATED_TIME
  }

  /** 权限详情请求 */
  export interface PermDetailRequest {
    permId: number;
  }

  /** 权限详情响应 */
  export interface PermDetailResponse {
    permId: number; // 对应数据库PERM_ID
    service: string; // 对应数据库SERVICE (所属服务)
    permName: string; // 对应数据库PERM_NAME (权限名称)
    permDesc?: string; // 对应数据库PERM_DESC (权限说明)
    permPrefix: string; // 对应数据库PERM_PREFIX (权限前缀)
    permPath: string; // 对应数据库PERM_PATH (权限路径)
    permType: string; // 对应数据库PERM_TYPE (权限类型)
    permStatus: string; // 对应数据库STATUS (权限状态)
    isSystem: boolean; // 对应数据库IS_SYSTEM (是否系统权限)
    permMethod: string; // 对应数据库PERM_METHOD (权限方法)
    permGroupCode?: string; // 对应数据库PERM_GROUP_CODE (权限组编码)
    createdTime: string; // 对应数据库CREATED_TIME
    updatedTime: string; // 对应数据库UPDATED_TIME
  }

  /** 创建权限请求 */
  export interface CreatePermRequest {
    service: string; // 对应数据库SERVICE (所属服务)
    permCode: string; // 对应数据库PERM_CODE
    permName: string; // 对应数据库PERM_NAME (权限名称)
    permDesc?: string; // 对应数据库PERM_DESC (权限说明)
    permPrefix: string; // 对应数据库PERM_PREFIX (权限前缀)
    permPath: string; // 对应数据库PERM_PATH (权限路径)
    permType: string; // 对应数据库PERM_TYPE (权限类型)
    permStatus?: string; // 对应数据库STATUS (权限状态)
    permMethod: string; // 对应数据库PERM_METHOD (权限方法)
    permGroupCode?: string; // 对应数据库PERM_GROUP_CODE (权限组编码)
  }

  /** 更新权限请求 */
  export interface UpdatePermRequest {
    permId: number; // 对应数据库PERM_ID
    service: string; // 对应数据库SERVICE (所属服务)
    permName: string; // 对应数据库PERM_NAME (权限名称)
    permDesc?: string; // 对应数据库PERM_DESC (权限说明)
    permPrefix: string; // 对应数据库PERM_PREFIX (权限前缀)
    permPath: string; // 对应数据库PERM_PATH (权限路径)
    permType: string; // 对应数据库PERM_TYPE (权限类型)
    permStatus?: string; // 对应数据库STATUS (权限状态)
    permMethod: string; // 对应数据库PERM_METHOD (权限方法)
    permGroupCode?: string; // 对应数据库PERM_GROUP_CODE (权限组编码)
  }

  /** 删除权限请求 */
  export interface DeletePermRequest {
    permId: number;
  }

  /** 更新权限状态请求 */
  export interface UpdatePermStatusRequest {
    permId: number;
    permStatus: string;
  }

  /** 权限树查询参数 */
  export interface GetPermTreeRequest {
    permType?: string;
    serviceModule?: string;
    permStatus?: string;
  }

  /** 获取所有权限查询参数 */
  export interface GetAllPermRequest {
    permType?: string;
  }

  /** 权限树响应数据 */
  export interface PermTreeResponse {
    permId: number;
    permPrefix: string;
    permName: string;
    permType: string;
    service: string;
    parentId?: number;
    hasChildren: boolean;
    children?: PermTreeResponse[];
  }

  /** 分页结果 */
  export interface PageResult<T> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
  }

  /** 权限组信息 */
  export interface PermissionGroupInfo {
    permGroupId: number;
    permGroupCode: string;
    permGroupName: string;
    permGroupDesc: string;
    sort: number;
    createdBy: number;
    createdTime: string;
    updatedBy: number;
    updatedTime: string;
    permissions: PermListResponse[];
  }

  /** 分组权限响应 */
  export interface GroupedPermissionsResponse {
    permissionGroups: PermissionGroupInfo[];
    ungroupedPermissions: PermListResponse[];
  }

  /** 通用响应 */
  export interface CommonResult<T = any> {
    code: string;
    message: string;
    data?: T;
  }
}

/**
 * 获取权限列表
 */
export async function getPermListApi(data: PermissionApi.GetPermListRequest) {
  return requestClient.get<
    PermissionApi.PageResult<PermissionApi.PermListResponse>
  >('/auth/perm/list', { params: data });
}

/**
 * 获取权限详情
 */
export async function getPermDetailApi(data: PermissionApi.PermDetailRequest) {
  return requestClient.get<PermissionApi.PermDetailResponse>(
    '/auth/perm/detail',
    { params: data },
  );
}

/**
 * 创建权限
 */
export async function createPermApi(data: PermissionApi.CreatePermRequest) {
  return requestClient.post<PermissionApi.CommonResult>(
    '/auth/perm/create',
    data,
  );
}

/**
 * 更新权限
 */
export async function updatePermApi(data: PermissionApi.UpdatePermRequest) {
  return requestClient.post<PermissionApi.CommonResult>(
    '/auth/perm/update',
    data,
  );
}

/**
 * 删除权限
 */
export async function deletePermApi(data: PermissionApi.DeletePermRequest) {
  return requestClient.post<PermissionApi.CommonResult>(
    '/auth/perm/delete',
    data,
  );
}

/**
 * 获取权限树
 */
export async function getPermTreeApi(data: PermissionApi.GetPermTreeRequest) {
  return requestClient.get<PermissionApi.PermTreeResponse[]>(
    '/auth/perm/tree',
    { params: data },
  );
}

/**
 * 获取所有权限（用于角色分配）
 */
export async function getAllPermissionsApi(
  data: PermissionApi.GetAllPermRequest,
) {
  return requestClient.get<PermissionApi.GroupedPermissionsResponse>(
    '/auth/perm/all',
    { params: data },
  );
}

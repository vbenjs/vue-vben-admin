import { requestClient } from '#/api/request';

export namespace RoleApi {
  /** 角色列表查询参数 */
  export interface GetRoleListRequest {
    pageNum?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: string;
    keyword?: string;
    roleCode?: string;
    roleName?: string;
    roleStatus?: string;
    isSystem?: string;
  }

  /** 角色列表响应数据 */
  export interface RoleListResponse {
    roleId: number;
    roleCode: string;
    roleName: string;
    roleDesc?: string;
    roleStatus: string;
    isSystem: string;
    createdTime: string;
    updatedTime: string;
  }

  /** 角色详情请求 */
  export interface RoleDetailRequest {
    roleId: number;
  }

  /** 角色详情响应 */
  export interface RoleDetailResponse {
    roleId: number;
    roleCode: string;
    roleName: string;
    roleDesc?: string;
    roleStatus: string;
    isSystem: string;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    updatedBy: number;
  }

  /** 创建角色请求 */
  export interface CreateRoleRequest {
    roleCode: string;
    roleName: string;
    roleDesc?: string;
    roleStatus: string;
  }

  /** 更新角色请求 */
  export interface UpdateRoleRequest {
    roleId: number;
    roleName: string;
    roleDesc?: string;
    roleStatus: string;
  }

  /** 删除角色请求 */
  export interface DeleteRoleRequest {
    roleId: number;
  }

  /** 角色权限响应 */
  export interface RolePermissionsResponse {
    roleId: number;
    roleCode: string;
    roleName: string;
    permissions: PermissionInfo[];
  }

  /** 权限信息 */
  export interface PermissionInfo {
    permId: number;
    service: string;
    permCode: string;
    permName: string;
    permDesc: string;
    permPrefix: string;
    permPath: string;
    permType: string;
    permStatus: string;
    permMethod: string;
    isSystem: string;
    permGroupCode: string;
    createdTime: string;
    updatedTime: string;
  }

  /** 分配角色权限请求 */
  export interface AssignRolePermissionsRequest {
    roleId: number;
    permissionCodes: string[];
  }

  /** 菜单信息 */
  export interface MenuInfo {
    menuId: number;
    menuCode: string;
    menuName: string;
    menuType: string;
    routerName: string;
    routerPath: string;
    componentPath: string;
    icon: string;
    isShow: string;
    sort: number;
    parentMenuCode: null | string;
    createdTime: string;
  }

  /** 角色菜单响应 */
  export interface RoleMenusResponse {
    roleCode: string;
    menus: MenuInfo[];
  }

  /** 获取角色菜单请求 */
  export interface GetRoleMenusRequest {
    roleCode: string;
  }

  /** 分配角色菜单请求 */
  export interface AssignRoleMenusRequest {
    roleCode: string;
    menuCodes: string[];
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
 * 获取角色列表
 */
export async function getRoleListApi(data: RoleApi.GetRoleListRequest) {
  return requestClient.get<RoleApi.PageResult<RoleApi.RoleListResponse>>(
    '/auth/role/list',
    { params: data },
  );
}

/**
 * 获取角色详情
 */
export async function getRoleDetailApi(data: RoleApi.RoleDetailRequest) {
  return requestClient.get<RoleApi.RoleDetailResponse>('/auth/role/detail', {
    params: data,
  });
}

/**
 * 创建角色
 */
export async function createRoleApi(data: RoleApi.CreateRoleRequest) {
  return requestClient.post<RoleApi.CommonResult>('/auth/role/create', data);
}

/**
 * 更新角色
 */
export async function updateRoleApi(data: RoleApi.UpdateRoleRequest) {
  return requestClient.put<RoleApi.CommonResult>('/auth/role/update', data);
}

/**
 * 删除角色
 */
export async function deleteRoleApi(data: RoleApi.DeleteRoleRequest) {
  return requestClient.delete<RoleApi.CommonResult>('/auth/role/delete', {
    data,
  });
}

/**
 * 获取角色权限
 */
export async function getRolePermissionsApi(data: RoleApi.RoleDetailRequest) {
  return requestClient.post<RoleApi.RolePermissionsResponse>(
    '/auth/role/permissions',
    data,
  );
}

/**
 * 分配角色权限
 */
export async function assignRolePermissionsApi(
  data: RoleApi.AssignRolePermissionsRequest,
) {
  return requestClient.post<RoleApi.CommonResult>(
    '/auth/role/assign-permissions',
    data,
  );
}

/**
 * 获取角色菜单
 */
export async function getRoleMenusApi(params: RoleApi.GetRoleMenusRequest) {
  return requestClient.get<RoleApi.MenuInfo[]>('/auth/role/menus', {
    params,
  });
}

/**
 * 分配角色菜单
 */
export async function assignRoleMenusApi(data: RoleApi.AssignRoleMenusRequest) {
  return requestClient.post<RoleApi.CommonResult>(
    '/auth/role/assign-menus',
    data,
  );
}

/**
 * 获取所有角色（用于下拉选择）
 */
export async function getAllRolesApi() {
  return requestClient.get<RoleApi.RoleListResponse[]>('/auth/role/all');
}

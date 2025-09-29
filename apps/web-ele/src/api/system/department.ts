import { requestClient } from '#/api/request';

export namespace DepartmentApi {
  /** 部门树表查询参数 (分页扁平模式) */
  export interface GetDepartmentTreeTableRequest {
    // 分页参数 (继承自父类)
    pageNum?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: string;
    keyword?: string;

    // 部门特有参数
    depCode?: string;
    depName?: string;
    dataPermType?: string;
    depStatus?: string;
    lazy?: boolean;
  }

  /** 部门树表节点 - Element UI专用 */
  export interface DepartmentTreeTableNode {
    depId: number; // Element UI row-key - 对应数据库DEP_ID
    depCode: string;
    depName: string;
    parentDepCode?: string;
    level: number;
    isSystem: string;
    sort?: number;
    depStatus: string;
    dataPermType: string;
    hasChildren: boolean; // Element UI重要字段
    isLeaf: boolean;
    createdTime: string;
    updatedTime: string;
    children?: DepartmentTreeTableNode[];
  }

  /** 获取完整树形表格请求 */
  export interface GetDepartmentFullTreeRequest {
    maxDepth?: number;
    depStatus?: string;
    keyword?: string;
    includeDisabled?: boolean;
    expandAll?: boolean;
    includeUserCount?: boolean;
  }

  /** 部门详情请求 */
  export interface DepartmentDetailRequest {
    depId: number;
  }

  /** 部门详情响应 */
  export interface DepartmentDetailResponse {
    depId: number;
    depName: string;
    depCode: string;
    parentDepCode?: string;
    isSystem: string;
    sort?: number;
    level: number;
    dataPermType: string;
    depStatus: string;
    depPath: string;
    customDataPermissions?: string[];
    createdTime: string;
    updatedTime: string;
  }

  /** 创建部门请求 */
  export interface CreateDepartmentRequest {
    depCode: string;
    depName: string;
    parentDepCode?: string;
    dataPermType: string;
    depStatus?: string;
    sort?: number;
    customDataPermissions?: string[];
  }

  /** 更新部门请求 */
  export interface UpdateDepartmentRequest {
    depId: number;
    depCode?: string;
    depName?: string;
    parentDepCode?: string;
    dataPermType?: string;
    depStatus?: string;
    sort?: number;
    customDataPermissions?: string[];
    newParentDepCode?: string; // 支持层级调整
  }

  /** 删除部门请求 */
  export interface DeleteDepartmentRequest {
    depId: number;
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
 * 获取部门详情
 */
export async function getDepartmentDetailApi(
  data: DepartmentApi.DepartmentDetailRequest,
) {
  return requestClient.get<DepartmentApi.DepartmentDetailResponse>(
    '/auth/department/detail',
    { params: data },
  );
}

/**
 * 获取完整部门树形表格
 */
export async function getDepartmentFullTreeApi(
  data: DepartmentApi.GetDepartmentFullTreeRequest,
) {
  return requestClient.get<DepartmentApi.DepartmentTreeTableNode[]>(
    '/auth/department/getFullTree',
    { params: data },
  );
}

/**
 * 创建部门 - 返回树形节点
 */
export async function createDepartmentApi(
  data: DepartmentApi.CreateDepartmentRequest,
) {
  return requestClient.post<DepartmentApi.CommonResult>(
    '/auth/department/create',
    data,
  );
}

/**
 * 更新部门 - 返回树形节点
 */
export async function updateDepartmentApi(
  data: DepartmentApi.UpdateDepartmentRequest,
) {
  return requestClient.put<DepartmentApi.CommonResult>(
    '/auth/department/update',
    data,
  );
}

/**
 * 删除部门
 */
export async function deleteDepartmentApi(
  data: DepartmentApi.DeleteDepartmentRequest,
) {
  return requestClient.delete<DepartmentApi.CommonResult>(
    '/auth/department/delete',
    { data },
  );
}

import { requestClient } from '#/api/request';

interface SysRoleVO {
  id?: number;
  name: string;
  roleCode: string;
  remark: null | string;
  menuIdList?: null | number[];
  createTime?: string;
}

interface Result<T> {
  code: number;
  msg: string;
  data: T;
}

interface RoleListResult {
  code: number;
  msg: string;
  data: SysRoleVO[];
}

interface RolePageParams {
  page?: number;
  limit?: number;
  name?: string;
  roleCode?: string;
  order?: string;
  asc?: boolean;
}

// 菜单权限interface ResultListSysMenuVO {
//   id: number;

// }

// 获取角色列表
export async function getAllRoleApi(
  params: RolePageParams,
): Promise<Result<SysRoleVO[]>> {
  return requestClient.get<RoleListResult>('/sys/role/list', {
    params,
  });
}

// 获取角色列表(分页)
export async function getRolePage(params: any) {
  return requestClient.post('/sys/role/page', params);
}

// 获取角色详情
export async function getRoleInfoApi(id: number): Promise<Result<SysRoleVO>> {
  return requestClient.get<Result<SysRoleVO>>(`/sys/role/${id}`);
}

// 添加角色
export async function addRoleApi(data: SysRoleVO): Promise<Result<string>> {
  return requestClient.post<Result<string>>('/sys/role', data);
}

// 更新角色
export async function updateRoleApi(data: SysRoleVO): Promise<Result<string>> {
  return requestClient.put<Result<string>>('/sys/role', data);
}

// 删除角色
export async function deleteRoleApi(id: number): Promise<Result<string>> {
  return requestClient.delete<Result<string>>(`/sys/role/${id}`);
}

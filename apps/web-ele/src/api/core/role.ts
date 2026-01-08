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

// 定义菜单数据类型
interface MenuData {
  id: number;
  pid: null | number;
  children?: MenuData[];
  name: string;
  url?: null | string;
  type: number;
  icon?: null | string;
  authority?: null | string;
  sort: number;
  meta?: {
    authority?: null | string;
    icon: string;
    title: string;
  };
}
interface UserInfo {
  id: number;
  username: string;
  avatar?: string;
  createTime?: string;
  roleName?: string;
}
interface RoleInfo {
  id: number;
  name: string;
  roleCode: string;
  remark?: string;
  createTime?: string;
  menuIdList?: number[];
}
interface MenuItem {
  id: number;
  name: string;
  children?: MenuItem[];
  type?: number;
}

// 获取菜单列表
export async function getAllRoleApi(
  params: RolePageParams,
): Promise<Result<SysRoleVO[]>> {
  return requestClient.get<RoleListResult>('/api/sys:menu/list', {
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

// 获取菜单树结构
export async function getMenuTreeApi(): Promise<Result<MenuData[]>> {
  return requestClient.get<Result<MenuData[]>>('/sys:menu/list');
}

// 获取角色已有菜单权限
export async function getRoleMenuIdsApi(
  roleId: number,
): Promise<Result<number[]>> {
  return requestClient.get<Result<number[]>>(`/sys/role/${roleId}/menus`);
}
// 保存角色菜单权限
export async function saveRoleMenusApi(
  roleId: number,
  menuIds: number[],
): Promise<Result<string>> {
  return requestClient.post<Result<string>>(`/sys/role/${roleId}/menus`, {
    menuIds,
  });
}
// 角色权限
export async function getMenuList(): Promise<Result<MenuData[]>> {
  return requestClient.get<Result<MenuData[]>>('/sys:menu/list');
}

// 更新角色
export async function updateRoleApi(data: SysRoleVO): Promise<Result<string>> {
  return requestClient.put<Result<string>>('/sys/role', data);
}

// 删除角色
export async function deleteRoleApi(integers: number[]) {
  return requestClient.delete('/sys/role', { data: integers });
}

// 获取角色已有用户ID列表
export async function getRoleUserIdsApi(
  roleId: number,
): Promise<Result<number[]>> {
  return requestClient.get<Result<number[]>>(`/sys/role/${roleId}/users`);
}

// 保存角色用户分配
export async function saveRoleUsersApi(
  roleId: number,
  userIds: number[],
): Promise<Result<string>> {
  return requestClient.post<Result<string>>(`/sys/role/${roleId}/users`, {
    userIds,
  });
}

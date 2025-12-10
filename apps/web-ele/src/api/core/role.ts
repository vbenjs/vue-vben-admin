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

// 获取角色分页列表
export async function getRoleListApi(
  params: RolePageParams,
): Promise<Result<SysRoleVO[]>> {
  return requestClient.get<RoleListResult>('/sys/role/list', {
    params,
  });
}

// 获取角色详情
export async function getRoleInfoApi(id: number): Promise<Result<SysRoleVO>> {
  return requestClient.get<Result<SysRoleVO>>(`/sys/role/${id}`);
}

// 添加角色 - 连接真实后端
// export async function addRoleApi(data: SysRoleVO): Promise<Result<string>> {
//   try {
//     console.log('🚀 发送添加角色请求到后端:', data);

//     // 使用 requestClient 发送请求
//     const result = await requestClient.post<Result<string>>('/sys/role', data);

//     console.log('📥 后端返回结果:', result);

//     // 如果后端返回null，抛出错误
//     if (!result) {
//       throw new Error('后端返回null响应');
//     }

//     return result;
//   } catch (error: any) {
//     console.error('❌ 添加角色接口错误:', error);

//     // 重新抛出错误，让前端可以捕获并显示
//     throw error;
//   }
// }

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

import { requestClient } from '#/api/request';

/**
 * 获取所有后台用户身份
 */
export async function getSystemAllRoles(params: any) {
  return requestClient.get('/admin/system/getSystemAllRoles', { params });
}

/**
 * 获取所有后台用户
 */
export async function createRole(params: any) {
  return requestClient.get('/admin/system/getALLSystemUser', { params });
}

/**
 * 获取所有后台用户
 */
export async function deleteRole(params: any) {
  return requestClient.get('/admin/system/getALLSystemUser', { params });
}

/**
 * 获取所有后台用户
 */
export async function updateRole(params: any, test: any) {
  return requestClient.get('/admin/system/getALLSystemUser', { params });
}

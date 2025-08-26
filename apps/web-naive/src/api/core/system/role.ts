import { requestClient } from '#/api/request';

/**
 * 获取所有后台用户身份
 */
export async function getSystemAllRoles(params: any) {
  return requestClient.get('/admin/system/getSystemAllRoles', { params });
}

/**
 * 修改后台用户身份信息
 */
export async function editSystemRolesInfo(data: any) {
  return requestClient.put('/admin/system/editSystemRolesInfo', data);
}

/**
 * 新增后台用户身份
 */
export async function addSystemRoles(data: any) {
  return requestClient.post('/admin/system/addSystemRoles', data);
}

/**
 * 删除后台用户身份
 */
export async function deleteSystemRoles(data: any) {
  return requestClient.delete('/admin/system/deleteSystemRoles', data);
}

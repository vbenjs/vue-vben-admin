import { requestClient } from '#/api/request';

/**
 * 获取所有后台用户
 */
export async function getALLSystemUser() {
  return requestClient.get('/admin/system/getALLSystemUser');
}

// 编辑系统用户信息
export async function editSystemUserInfo(data: any) {
  return requestClient.put('/admin/system/editSystemUserInfo', data);
}

// 添加系统用户
export async function addSystemUser(data: any) {
  return requestClient.post('/admin/system/addSystemUser', data);
}

// 删除系统用户
export async function deleteSystemUser(data: any) {
  return requestClient.delete('/admin/system/deleteSystemUser', data);
}

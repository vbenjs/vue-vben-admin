import { requestClient } from '#/api/request';

/**
 * 获取所有后台用户
 */
export async function getMenuList(params: any) {
  return requestClient.get('/admin/system/getALLSystemUser', { params });
}

import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type RoleEntity from './RoleEntity';

const domain = '/roles';

export function listRoles(params: SearchParameters) {
  return defHttp.get<PageResult<RoleEntity>>({ url: domain, params }, { joinParamsToUrl: true });
}

export function loadRole(id: number) {
  return defHttp.get<RoleEntity>({ url: `${domain}/${id}` });
}

export function createRole(data: RoleEntity) {
  return defHttp.post<RoleEntity>({ url: domain, data });
}

export function updateRole(id: number, data: RoleEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteRole(id: number) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export function listRoleCheckedPermissionIds(id: number) {
  return defHttp.get<number[]>({ url: `${domain}/${id}/checked-permission-ids` });
}

export function roleAuthorize(
  id: number,
  data: { checkedIds: number[]; halfCheckedIds: number[] },
) {
  return defHttp.put<null>({
    url: `${domain}/${id}/authorize`,
    data: data,
  });
}

export { RoleEntity };

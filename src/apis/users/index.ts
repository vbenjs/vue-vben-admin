import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type { UserEntity } from './UserEntity';

const domain = '/users';

export function listUsers(params: SearchParameters) {
  return defHttp.get<PageResult<UserEntity>>({ url: domain, params }, { joinParamsToUrl: true });
}

export function loadUser(id: number) {
  return defHttp.get<UserEntity>({ url: `${domain}/${id}` });
}

export function createUser(data: UserEntity) {
  return defHttp.post<UserEntity>({ url: domain, data });
}

export function updateUser(id: number, data: UserEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteUser(id: number) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export function listUserDepartmentIds(id: number) {
  return defHttp.get<number[]>({ url: `${domain}/${id}/department-ids` });
}

export function setUserDepartmentIds(id: number, departmentIds: number[]) {
  return defHttp.put<null>({
    url: `${domain}/${id}/department-ids`,
    data: { data: departmentIds },
  });
}

export function listUserRoleIds(id: number) {
  return defHttp.get<number[]>({ url: `${domain}/${id}/role-ids` });
}

export function setUserRoleIds(id: number, roleIds: number[] = []) {
  return defHttp.put<null>({ url: `${domain}/${id}/role-ids`, data: { data: roleIds } });
}

export { UserEntity };

import { RoleResult } from '../../ApiModel/system/roleModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  role = '/admin/sysRole',
  info = '/admin/sysRole/info',
  createRole = '/admin/sysRole/create',
  deleteRole = '/admin/sysRole/delete',
  updateRole = '/admin/sysRole/update',
  sort = '/admin/sysRole/sort',

  allPlatform = '/admin/sysRole/allPlatform',
}

export function getRole(data = {}, isTable = false) {
  return defHttp.post<RoleResult[]>(
    {
      url: Api.role,
      data,
    },
    { isTable },
  );
}

export function getRoleById(id: number) {
  return defHttp.post<RoleResult>({
    url: Api.info,
    data: { id },
  });
}

export function createRole(data = {}) {
  return defHttp.post<null>({
    url: Api.createRole,
    data,
  });
}

export function updateRole(data = {}) {
  return defHttp.post<null>({
    url: Api.updateRole,
    data,
  });
}

export function deleteRole(id: number) {
  return defHttp.post<null>({
    url: Api.deleteRole,
    data: { id },
  });
}

export function sortRole(sortData: { id: number; sortNum: number }[]) {
  return defHttp.post<null>({
    url: Api.sort,
    data: { sortData },
  });
}

export function getAllPlatform() {
  return defHttp.post({
    url: Api.allPlatform,
  });
}

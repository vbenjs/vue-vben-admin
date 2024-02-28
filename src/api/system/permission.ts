import { PermissionTree } from '../../ApiModel/system/permissionModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  permission = '/admin/permission/',
  permissionInfo = '/admin/permission/info',
  permissionData = '/admin/permission/data',
  getAction = '/admin/permission/action',
  getActions = '/admin/permission/actions',
  saveAction = '/admin/permission/saveAction',
  deleteAction = '/admin/permission/deleteAction',
  defHttp = '/admin/permission/defHttp',
  createdefHttp = '/admin/permission/createdefHttp',
  updatedefHttp = '/admin/permission/updatedefHttp',
  deletedefHttp = '/admin/permission/deletedefHttp',
  update = '/admin/permission/update',
  tree = '/admin/permission/tree',
  savePermission = '/admin/permission/savePermission',
  deletePermission = '/admin/permission/deletePermission',
  reset = '/admin/permission/reset',
}
export function getPermissionTree() {
  return defHttp.post<PermissionTree[]>({
    url: Api.tree,
  });
}

export function getPermissionById(id: number) {
  return defHttp.post<PermissionTree>({
    url: Api.permissionData,
    data: { id },
  });
}
export function savePermission(data: any) {
  return defHttp.post<null>({
    url: Api.savePermission,
    data,
  });
}
export function deletePermission(ids: number[]) {
  return defHttp.post<null>({
    url: Api.deletePermission,
    data: { ids },
  });
}

export function getActionById(id: number) {
  return defHttp.post({
    url: Api.getAction,
    data: { id },
  });
}

export function getActions(id: number) {
  return defHttp.post({
    url: Api.getActions,
    data: { id },
  });
}

export function saveAction(data: any) {
  return defHttp.post<null>({
    url: Api.saveAction,
    data,
  });
}
export function deleteAction(ids: number[]) {
  return defHttp.post<null>({
    url: Api.deleteAction,
    data: { ids },
  });
}

export function getdefHttps(id: number) {
  return defHttp.post({
    url: Api.defHttp,
    data: { id },
  });
}

export function createdefHttp(data) {
  return defHttp.post({
    url: Api.createdefHttp,
    data,
  });
}

export function updatedefHttp(data) {
  return defHttp.post({
    url: Api.updatedefHttp,
    data,
  });
}

export function deletedefHttp(ids: number[]) {
  return defHttp.post<null>({
    url: Api.deletedefHttp,
    data: { ids },
  });
}

export function resetAuth() {
  return defHttp.get<null>({ url: Api.reset });
}

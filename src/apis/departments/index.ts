import { defHttp } from '/@/utils/http/axios';

import type TreeNode from '../TreeNode';
import type DepartmentEntity from './DepartmentEntity';

const domain = '/departments';

export function listDepartmentTree() {
  return defHttp.get<TreeNode[]>({ url: `${domain}/tree` });
}

export function loadDepartment(id: string) {
  return defHttp.get<DepartmentEntity>({ url: `${domain}/${id}` });
}

export function createDepartment(data: DepartmentEntity) {
  return defHttp.post<DepartmentEntity>({ url: domain, data });
}

export function updateDepartment(id: string, data: DepartmentEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteDepartment(id: string) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export { DepartmentEntity };

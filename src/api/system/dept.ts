import { BasicPageParams, BasicPaginationResult } from '../model/baseModel';
import { defHttp } from '/@/utils/http/axios';

export interface Dept {
  createAt: string;
  updatedAt: string;
  id: number;
  parentId: number;
  name: string;
  orderNo: number;
}

export type DeptListResult = BasicPaginationResult<Dept>;

export interface CreateDeptParams {
  parentId: number;
  name: string;
  orderNo: number;
}

export interface UpdateDeptParams extends CreateDeptParams {
  id: number;
}

export interface DeptInfo {
  createAt: string;
  updatedAt: string;
  id: number;
  parentId: number;
  name: string;
  orderNo: number;
}

enum Api {
  Base = '/system/depts',
}

export const getDeptList = (params?: BasicPageParams) =>
  defHttp.get<DeptListResult>({ url: Api.Base, params });

export const getDeptInfo = (id) => defHttp.get<DeptInfo>({ url: `${Api.Base}/${id}` });

export const createDept = (params: CreateDeptParams) => defHttp.post({ url: Api.Base, params });

export const updateDept = (id: number, params: UpdateDeptParams) =>
  defHttp.put({ url: `${Api.Base}/${id}`, params });

export const deleteDept = (id) => defHttp.delete({ url: `${Api.Base}/${id}` });

import { defHttp } from '@/utils/http/axios';
import { DeptListGetResultModel, DeptListItem } from './model/deptModel';

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: '/dept', params }, { isTransformResponse: false });

export const saveDept = (data: any, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/dept/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/dept', data }, { isTransformResponse: false });
};

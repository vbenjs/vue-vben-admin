import { defHttp } from '@/utils/http/axios';

import { RoleListItem, RolePageListGetResultModel, RolePageParams } from './model/roleModel';

export const saveRole = (data: Partial<RoleListItem>, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/role/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/role', data }, { isTransformResponse: false });
};

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: '/role', params }, { isTransformResponse: false });

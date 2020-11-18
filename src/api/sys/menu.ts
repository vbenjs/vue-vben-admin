import { defHttp } from '/@/utils/http/axios';

import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from './model/menuModel';

enum Api {
  GetMenuListById = '/getMenuListById',
}

/**
 * @description: Get user menu based on id
 */
export function getMenuListById(params: getMenuListByIdParams) {
  return defHttp.request<getMenuListByIdParamsResultModel>({
    url: Api.GetMenuListById,
    method: 'GET',
    params,
  });
}

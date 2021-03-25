import { defHttp } from '/@/utils/http/axios';
import { getMenuListByIdParams, getMenuListByIdParamsResultModel } from './model/menuModel';

enum Api {
  GetMenuListById = '/getMenuListById',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuListById = (params: getMenuListByIdParams) => {
  return defHttp.get<getMenuListByIdParamsResultModel>({ url: Api.GetMenuListById, params });
};

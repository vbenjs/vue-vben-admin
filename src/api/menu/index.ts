import { defHttp } from '@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getVirtualMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

export const getMenuList = (params?: { origin: boolean }) => {
  return defHttp.get<getMenuListResultModel>(
    { url: '/sys-menu', params },
    { isTransformResponse: false },
  );
};

import { defHttp } from '@/utils/http/axios';
import { MenuListItem, getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getVirtualMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

export const getMenuList = (params?: { mode?: string; show?: string }) => () => {
  return defHttp.get<getMenuListResultModel>(
    { url: '/sys-menu', params },
    { isTransformResponse: false },
  );
};

export const saveMenu = (data: MenuListItem, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/sys-menu/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/sys-menu', data }, { isTransformResponse: false });
};

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

export const getPermList = () => {
  return defHttp.get<getMenuListResultModel>(
    { url: '/sys-menu/perm' },
    { isTransformResponse: false },
  );
};

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: '/sys-menu' }, { isTransformResponse: false });
};

export const saveMenu = (data: MenuListItem, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/sys-menu/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/sys-menu', data }, { isTransformResponse: false });
};

import http from '@/utils/http/axios';
import {
  GetByUserIdParams,
  GetMenuListByUserIdResult,
  GetAuthCodeByUserIdResult,
} from './model/menuModel';

enum Api {
  GetMenuListByUserId = '/getMenuListByUserId',
  GetBtnCodeListByUserId = '/getBtnCodeListByUserId',
}

/**
 * @description: 根据用户id获取用户菜单
 */
export function getUserInfoById(params: GetByUserIdParams) {
  return http.request<GetMenuListByUserIdResult>({
    url: Api.GetMenuListByUserId,
    method: 'GET',
    params,
  });
}

/**
 * 根据用户Id获取权限编码
 * @param params
 */
export function getBtnCodeListByUserId(params: GetByUserIdParams) {
  return http.request<GetAuthCodeByUserIdResult>({
    url: Api.GetBtnCodeListByUserId,
    method: 'GET',
    params,
  });
}

import http from '@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel,
} from './model/userModel';

enum Api {
  Login = '/login',
  GetUserInfoById = '/getUserInfoById',
}

/**
 * @description: 用户登录
 */
export function loginApi(params: LoginParams) {
  return http.request<LoginResultModel>({
    url: Api.Login,
    method: 'POST',
    params,
  });
}

/**
 * @description: 根据用户id获取用户信息
 */
export function getUserInfoById(params: GetUserInfoByUserIdParams) {
  return http.request<GetUserInfoByUserIdModel>({
    url: Api.GetUserInfoById,
    method: 'GET',
    params,
  });
}

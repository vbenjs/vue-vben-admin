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
 * @description: 用户登陆
 */
export function loginApi(params: LoginParams) {
  return http.request<LoginResultModel>(
    {
      url: Api.Login,
      method: 'POST',
      params,
    },
    {
      // 登陆接口不加 /v1.0
      joinPrefix: false,
    }
  );
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

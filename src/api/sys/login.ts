import http from '@/utils/http/axios';
import { LoginParams, LoginResultModel } from './model/LoginModel';

enum Api {
  Login = '/login',
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

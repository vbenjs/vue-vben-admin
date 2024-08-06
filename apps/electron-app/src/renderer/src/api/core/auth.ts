import { requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    desc: string;
    realName: string;
    refreshToken: string;
    userId: string;
    username: string;
  }
}

/**
 * 登录
 */
export async function login(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/**
 * 获取用户权限码
 */
export async function getAccessCodes() {
  return requestClient.get<string[]>('/auth/codes');
}

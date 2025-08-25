import { client, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
// export async function loginApi(data: AuthApi.LoginParams) {
//   return requestClient.post<AuthApi.LoginResult>('/auth/login', data, {
//     withCredentials: true,
//   });
// }
export async function loginApi(params: AuthApi.LoginParams) {
  const method = client.post<AuthApi.LoginResult>('/auth/login', params);
  method.meta = {
    authRole: 'login',
  };
  return method;
}

/**
 * 刷新accessToken
 */
// export async function refreshTokenApi() {
//   return baseRequestClient.post<AuthApi.RefreshTokenResult>(
//     '/auth/refresh',
//     null,
//     {
//       withCredentials: true,
//     },
//   );
// }
export async function refreshTokenApi() {
  const method = client.post<AuthApi.RefreshTokenResult>('/auth/refresh');
  method.meta = {
    authRole: 'refreshToken',
  };
  return method;
}

/**
 * 退出登录
 */
// export async function logoutApi() {
//   return baseRequestClient.post('/auth/logout', null, {
//     withCredentials: true,
//   });
// }

export async function logoutApi() {
  const method = client.post('/auth/logout');
  method.meta = {
    authRole: 'logout',
  };
  return method;
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

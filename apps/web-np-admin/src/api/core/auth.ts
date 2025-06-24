import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/admin/auth/login', data);
}

export async function refreshTokenApi() {
  const refreshURL = '/admin/auth/refresh';
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(refreshURL, {
    withCredentials: true,
  });
}

export async function logoutApi() {
  return null;
}

export async function getAccessCodesApi() {
  return [];
}

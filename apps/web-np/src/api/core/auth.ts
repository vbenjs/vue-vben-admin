import { useAppConfig } from '@vben/hooks';

import { baseRequestClient, requestClient } from '#/api/request';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    myshopifyDomain?: string;
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

export function generateAuthUrl(data: AuthApi.LoginParams) {
  const shopifyDomain: string =
    data.myshopifyDomain
      ?.replaceAll(/\s/g, '')
      .replace('https://', '')
      .replace('http://', '')
      .replace('.myshopify.com', '') ?? '';

  return `${apiURL}/auth/generate?subdomain=${shopifyDomain}`;
}

export async function loginApiViaShopifySession(data: any) {
  return requestClient.post<AuthApi.LoginResult>(
    '/auth/verify-shopify-session',
    data,
  );
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function logoutApi() {}

export async function getAccessCodesApi() {
  return [];
}

import { OAuth2TokenResponse } from './OAuth2TokenResponse';
import { UserinfoResponse } from './UserinfoResponse';
import { defHttp, oauth2Http } from '/@/utils/http/axios';
import qs from 'qs';

/**
 * 客户端认证
 */
export function authorize() {
  const server = import.meta.env.VITE_GLOB_OAUTH2_SERVER;
  const clientId = import.meta.env.VITE_GLOB_OAUTH2_CLIENT_ID;
  const redirectUri = window.location.origin + window.location.pathname;
  window.location.href = `${server}/oauth2/authorize?response_type=code&client_id=${clientId}&scope=all&state=${new Date().getTime()}&redirect_uri=${redirectUri}`;
}

/**
 * 授权码登录
 * @param code 授权码
 */
export function loginByAuthorizationCode(code: string) {
  return oauth2Http.post<OAuth2TokenResponse>({
    url: '/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_GLOB_OAUTH2_CLIENT_ID,
      client_secret: import.meta.env.VITE_GLOB_OAUTH2_CLIENT_SECRET,
      redirect_uri: window.location.origin + window.location.pathname,
      code: code,
    }),
  });
}

export function userinfo() {
  return defHttp.get<UserinfoResponse>({ url: '/userinfo' });
}

export function logout() {
  window.location.replace(
    `${import.meta.env.VITE_GLOB_OAUTH2_SERVER}/logout?redirect_uri=${window.location.origin}`,
  );
}

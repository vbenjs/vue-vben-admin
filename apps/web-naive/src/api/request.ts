/**
 * 该文件可自行根据业务逻辑进行调整
 */
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  dataDestructuringResponseInterceptor,
  errorMessageResponseInterceptor,
  headersRequestInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { refreshTokenApi } from '#/api/core';
import { message } from '#/naive';
import { useAuthStore } from '#/store';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
  });

  async function toReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (preferences.app.loginExpiredMode === 'modal') {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  async function toRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function generateHeaders(): Record<string, string> {
    const accessStore = useAccessStore();
    return {
      'Accept-Language': preferences.app.locale,
      Authorization: `Bearer ${accessStore.accessToken}`,
    };
  }

  // 请求头处理
  client.addRequestInterceptor(headersRequestInterceptor(generateHeaders));

  // response数据解构
  client.addResponseInterceptor(dataDestructuringResponseInterceptor());

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor(
      client,
      preferences.app.refreshToken,
      toReAuthenticate,
      toRefreshToken,
    ),
  );

  client.addResponseInterceptor({
    rejected: () =>
      errorMessageResponseInterceptor((msg: any) => message.error(msg)),
  });

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });

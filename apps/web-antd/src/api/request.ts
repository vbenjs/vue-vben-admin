/**
 * 该文件可自行根据业务逻辑进行调整
 */
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { BaseRequestClient, type HttpResponse } from '@vben/request';
import { RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { refreshTokenApi } from '#/api/core';
import { useAuthStore } from '#/store';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
    // 为每个请求携带 Authorization
    makeAuthorization: () => {
      return {
        key: 'Authorization',
        tokenHandler: () => {
          const accessStore = useAccessStore();
          return {
            token: `${accessStore.accessToken}`,
          };
        },
        unAuthorizedHandler: async () => {
          const accessStore = useAccessStore();
          const authStore = useAuthStore();
          accessStore.setAccessToken(null);

          if (preferences.app.loginExpiredMode === 'modal') {
            accessStore.setLoginExpired(true);
          } else {
            // 退出登录
            await authStore.logout();
          }
        },
      };
    },
    makeErrorMessage: (msg) => message.error(msg),

    makeRequestHeaders: () => {
      return {
        // 为每个请求携带 Accept-Language
        'Accept-Language': preferences.app.locale,
      };
    },
  });

  client.addResponseInterceptor(
    (response) => response,
    async (error) => {
      const prevRequest = error.config;
      const accessStore = useAccessStore();
      if (error.response.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const { accessToken } = await refreshTokenApi();

        accessStore.setAccessToken(accessToken);
        return client.request(prevRequest.url, { ...prevRequest });
      }
      throw error;
    },
  );

  client.addResponseInterceptor<HttpResponse>((response) => {
    const { data: responseData, status } = response;

    const { code, data, message: msg } = responseData;
    if (status >= 200 && status < 400 && code === 0) {
      return data;
    }
    throw new Error(`Error ${status}: ${msg}`);
  });
  return client;
}

export const requestClient = createRequestClient(apiURL);

const baseRequestClient = new BaseRequestClient({ baseURL: apiURL });

baseRequestClient.addResponseInterceptor<HttpResponse>((response) => {
  const { data: responseData, status } = response;

  const { code, data, message: msg } = responseData;
  if (status >= 200 && status < 400 && code === 0) {
    return data;
  }
  throw new Error(`Error ${status}: ${msg}`);
});

export { baseRequestClient };

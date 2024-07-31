/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
    // 为每个请求携带 Authorization
    makeAuthorization: () => {
      return {
        // 默认
        key: 'Authorization',
        tokenHandler: () => {
          const accessStore = useAccessStore();
          return {
            refreshToken: `${accessStore.refreshToken}`,
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
    makeErrorMessage: (msg) => ElMessage.error(msg),

    makeRequestHeaders: () => {
      return {
        // 为每个请求携带 Accept-Language
        'Accept-Language': preferences.app.locale,
      };
    },
  });
  client.addResponseInterceptor<HttpResponse>((response) => {
    const { data: responseData, status } = response;

    const { code, data, message: msg } = responseData;
    if (status >= 200 && status < 400 && code === 0) {
      return data;
    }
    throw new Error(msg);
  });
  return client;
}

export const requestClient = createRequestClient(apiURL);

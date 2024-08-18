/**
 * 该文件可自行根据业务逻辑进行调整
 */
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { errorMessageResponseInterceptor, RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { refreshTokenApi } from '#/api/core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
  });

  client.addRequestInterceptor({
    fulfilled: (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = `Bearer ${accessStore.accessToken}`;
      config.headers['Accept-Language'] = preferences.app.locale;

      return config;
    },
  });

  client.addResponseInterceptor({
    fulfilled: (response) => {
      const { data: responseData, status } = response;

      const { code, data, message: msg } = responseData;
      if (status >= 200 && status < 400 && code === 0) {
        return data;
      }
      throw new Error(`Error ${status}: ${msg}`);
    },
  });

  client.addResponseInterceptor({
    rejected: async (error) => {
      // 非refreshToken的处理方式
      // if (error.response.status === 401) {
      //    const accessStore = useAccessStore();
      //    const authStore = useAuthStore();
      //    accessStore.setAccessToken(null);
      //
      //    if (preferences.app.loginExpiredMode === 'modal') {
      //      accessStore.setLoginExpired(true);
      //    } else {
      //      await authStore.logout();
      //    }
      //  }

      // refreshToken的处理方式
      const prevRequest = error.config;
      const accessStore = useAccessStore();
      if (error.response.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const resp = await refreshTokenApi();

        accessStore.setAccessToken(resp.data);
        return client.request(prevRequest.url, { ...prevRequest });
      }
      throw error;
    },
  });

  client.addResponseInterceptor({
    rejected: () =>
      errorMessageResponseInterceptor((msg: any) => message.error(msg)),
  });

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });

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

  client.addResponseInterceptor<HttpResponse>((response) => {
    const { data: responseData, status } = response;

    const { code, data, message: msg } = responseData;
    if (status >= 200 && status < 400 && code === 0) {
      return data;
    }
    throw new Error(`Error ${status}: ${msg}`);
  });

  // todo 这个拦截器需要在request-client内默认response interceptor之前注册
  // response interceptor按注册的顺序执行
  // request interceptor 逆序执行
  // 所以可以提供预设的interceptors，apps内按需要调整
  client.addResponseInterceptor(
    (response) => response,
    async (error) => {
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
  );

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new BaseRequestClient({ baseURL: apiURL });

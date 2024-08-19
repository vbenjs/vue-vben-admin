/**
 * 该文件可自行根据业务逻辑进行调整
 */
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { errorMessageResponseInterceptor, RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
  });

  function toReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (preferences.app.loginExpiredMode === 'modal') {
      accessStore.setLoginExpired(true);
    } else {
      authStore.logout();
    }
  }

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

  // 响应拦截器：处理 401 错误和刷新 token 逻辑
  client.addResponseInterceptor({
    rejected: async (error) => {
      const { config, response } = error;
      // 如果不是 401 错误，直接抛出异常
      if (response?.status !== 401) {
        throw error;
      }
      // 判断是否启用了 refreshToken 功能
      // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
      if (!preferences.app.refreshToken || config.__isRetryRequest) {
        toReAuthenticate();
        throw error;
      }
      // 如果正在刷新 token，则将请求加入队列，等待刷新完成
      if (client.isRefreshing) {
        return new Promise((resolve) => {
          client.refreshTokenQueue.push((newToken: string) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      // 标记开始刷新 token
      client.isRefreshing = true;
      // 标记当前请求为重试请求，避免无限循环
      config.__isRetryRequest = true;

      try {
        const accessStore = useAccessStore();
        const resp = await refreshTokenApi();
        const newToken = resp.data;
        accessStore.setAccessToken(newToken);

        // 处理队列中的请求
        client.refreshTokenQueue.forEach((callback) => callback(newToken));
        // 清空队列
        client.refreshTokenQueue = [];

        return client.request(error.config.url, { ...error.config });
      } catch (refreshError) {
        // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
        client.refreshTokenQueue.forEach((callback) => callback(''));
        client.refreshTokenQueue = [];
        console.error('Refresh token failed, please login again.');
        throw refreshError;
      } finally {
        client.isRefreshing = false;
      }
    },
  });

  // 通用的错误处理
  // 如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: any) => message.error(msg)),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });

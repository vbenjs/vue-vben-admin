/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { HttpResponse } from '@vben-core/request';

import { preferences } from '@vben-core/preferences';
import { RequestClient } from '@vben-core/request';

import { message } from 'ant-design-vue';

import { useAccessStore } from '#/store';

/**
 * 创建请求实例
 * Create a request instance
 */
function createRequestClient() {
  const client = new RequestClient({
    baseURL: import.meta.env.VITE_GLOB_API_URL,
    // 为每个请求携带 Authorization
    makeAuthorization: () => {
      return {
        // 默认
        key: 'Authorization',
        tokenHandler: () => {
          const accessStore = useAccessStore();
          return {
            refreshToken: `Bearer ${accessStore.refreshToken}`,
            token: `Bearer ${accessStore.accessToken}`,
          };
        },
        unAuthorizedHandler: async () => {
          const accessStore = useAccessStore();
          accessStore.setAccessToken(null);

          if (preferences.app.loginExpiredMode === 'modal') {
            accessStore.openLoginExpiredModal = true;
          } else {
            // 退出登录
            await accessStore.logout();
          }
        },
      };
    },
    makeErrorMessage: (msg) => message.error(msg),
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

const requestClient = createRequestClient();

// 其他配置的请求方法
// const { request: xxxRequest } = createRequest();

export { requestClient };

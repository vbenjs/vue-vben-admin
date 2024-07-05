/**
 * 该文件可自行根据业务逻辑进行调整
 */

import type { AxiosResponse } from '@vben-core/request';

import { RequestClient, isCancelError } from '@vben-core/request';
import { useCoreAccessStore } from '@vben-core/stores';

import { message } from 'ant-design-vue';

interface HttpResponse<T = any> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  data: T;
  message: string;
}

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
        handler: () => {
          // 这里不能用 useAccessStore，因为 useAccessStore 会导致循环引用
          const accessStore = useCoreAccessStore();
          return {
            refreshToken: `Bearer ${accessStore.getRefreshToken}`,
            token: `Bearer ${accessStore.getAccessToken}`,
          };
        },
        // 默认
        key: 'Authorization',
      };
    },
  });
  setupRequestInterceptors(client);
  return client;
}

function setupRequestInterceptors(client: RequestClient) {
  client.addResponseInterceptor(
    (response: AxiosResponse<HttpResponse>) => {
      const { data: responseData, status } = response;

      const { code, data, message: msg } = responseData;

      if (status >= 200 && status < 400 && code === 0) {
        return data;
      } else {
        message.error(msg);
        throw new Error(msg);
      }
    },
    (error: any) => {
      if (isCancelError(error)) {
        return Promise.reject(error);
      }

      const err: string = error?.toString?.() ?? '';
      let errMsg = '';
      if (err?.includes('Network Error')) {
        errMsg = '网络错误。';
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = '请求超时。';
      } else {
        const data = error?.response?.data;
        errMsg = (data?.message || data?.error?.message) ?? '';
      }

      message.error(errMsg);
      return Promise.reject(error);
    },
  );
}

const requestClient = createRequestClient();

// 其他配置的请求方法
// const { request: xxxRequest } = createRequest();

export { requestClient };

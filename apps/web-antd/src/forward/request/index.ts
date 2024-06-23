/**
 * 该文件可自行根据业务逻辑进行调整
 */

import type { AxiosResponse } from '@vben-core/request';

import { RequestClient, isCancelError } from '@vben-core/request';
import { useAccessStore } from '@vben-core/stores';

import { message } from 'ant-design-vue';

interface HttpResponse<T = any> {
  /**
   * 0 表示成功 其他表示失败
   * 0 means success, others means fail
   */
  code: number;
  message: string;
  result: T;
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
          const accessStore = useAccessStore();
          return accessStore.getAccessToken;
        },
        // 默认
        key: 'Authorization',
      };
    },
  });
  setupRequestInterceptors(client);
  const request = client.request.bind(client);
  const get = client.get.bind(client);
  const post = client.post.bind(client);
  return {
    get,
    post,
    request,
  };
}

function setupRequestInterceptors(client: RequestClient) {
  client.addResponseInterceptor(
    (response: AxiosResponse<HttpResponse>) => {
      const { data: responseData, status } = response;
      const { code, message: msg, result } = responseData;
      if (status === 200 && code === 0) {
        return result;
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
        errMsg = error?.response?.data?.error?.message ?? '';
      }
      message.error(errMsg);
      return Promise.reject(error);
    },
  );
}

const { request } = createRequestClient();

// 其他配置的请求方法
// const { request: xxxRequest } = createRequest();

export { request };

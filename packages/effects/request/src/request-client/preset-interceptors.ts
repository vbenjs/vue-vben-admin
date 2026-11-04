import type { Method } from 'axios';

import type { RequestClient } from './request-client';
import type {
  MakeErrorMessageFn,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from './types';

import { $t } from '@vben/locales';
import { isFunction, isString } from '@vben/utils';

import axios from 'axios';

function createIdempotencyKey() {
  // randomUUID 仅在安全上下文（https/localhost）可用，getRandomValues 不受此限制
  if (typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return Array.from(
    globalThis.crypto.getRandomValues(new Uint8Array(16)),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
}

export const defaultResponseInterceptor = ({
  // 已发布包的运行时契约：JS 消费方可能省略任一参数，省略时按上游
  // 语义回落到 code/data/0，参数类型因此标可选（默认值类型合法）。
  codeField = 'code',
  dataField = 'data',
  successCode = 0,
}: {
  /** 响应数据中代表访问结果的字段名 */
  codeField?: string;
  /** 响应数据中装载实际数据的字段名，或者提供一个函数从响应数据中解析需要返回的数据 */
  dataField?: ((response: any) => any) | string;
  /** 当codeField所指定的字段值与successCode相同时，代表接口访问成功。如果提供一个函数，则返回true代表接口访问成功 */
  successCode?: ((code: any) => boolean) | number | string;
}): ResponseInterceptorConfig => {
  return {
    fulfilled: (response) => {
      const { config, data: responseData, status } = response;

      if (config.responseReturn === 'raw') {
        return response;
      }

      if (status >= 200 && status < 400) {
        if (config.responseReturn === 'body') {
          return responseData;
        } else if (
          isFunction(successCode)
            ? successCode(responseData[codeField])
            : responseData[codeField] === successCode
        ) {
          return isFunction(dataField)
            ? dataField(responseData)
            : responseData[dataField];
        }
      }
      throw Object.assign({}, response, { response });
    },
  };
};

export const idempotencyRequestInterceptor = ({
  generateKey = createIdempotencyKey,
  headerName = 'Idempotency-Key',
  methods = ['POST', 'PUT', 'PATCH', 'DELETE'],
}: {
  /** 生成幂等键的函数，默认使用 crypto.randomUUID，非安全上下文中回退为 32 位随机十六进制字符串 */
  generateKey?: () => string;
  /** 携带幂等键的请求头名称 */
  headerName?: string;
  /** 自动附加幂等键的请求方法，传入空数组则只对显式设置了 idempotencyKey 的请求生效 */
  methods?: Method[];
} = {}): RequestInterceptorConfig => {
  const autoMethods = new Set(methods.map((method) => method.toUpperCase()));
  return {
    fulfilled: (config) => {
      const { idempotencyKey } = config;
      // 重试/重放的请求已携带幂等键，必须沿用同一个键，服务端才能识别为同一次提交
      if (idempotencyKey === false || config.headers.has(headerName)) {
        return config;
      }
      if (isString(idempotencyKey)) {
        config.headers.set(headerName, idempotencyKey);
      } else if (
        idempotencyKey === true ||
        autoMethods.has(config.method?.toUpperCase() ?? 'GET')
      ) {
        config.headers.set(headerName, generateKey());
      }
      return config;
    },
  };
};

export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  client: RequestClient;
  doReAuthenticate: () => Promise<void>;
  doRefreshToken: () => Promise<string>;
  enableRefreshToken: boolean;
  formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
  return {
    rejected: async (error) => {
      const { config, response } = error;
      // 如果不是 401 错误，直接抛出异常
      if (response?.status !== 401) {
        throw error;
      }
      // 判断是否启用了 refreshToken 功能
      // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
      if (!enableRefreshToken || config.__isRetryRequest) {
        await doReAuthenticate();
        throw error;
      }
      // 如果正在刷新 token，则将请求加入队列，等待刷新完成
      if (client.isRefreshing) {
        return new Promise((resolve, reject) => {
          client.refreshTokenQueue.push((newToken, refreshError) => {
            if (!newToken) {
              // Replaying the request without a token would only fail with
              // another 401 and start a second refresh attempt.
              reject(refreshError ?? new Error('Token refresh failed'));
              return;
            }
            config.headers.Authorization = formatToken(newToken);
            // Without the retry flag a queued request that keeps answering 401
            // would open a second refresh cycle once `isRefreshing` is false.
            config.__isRetryRequest = true;
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      // 标记开始刷新 token
      client.isRefreshing = true;
      // 标记当前请求为重试请求，避免无限循环
      config.__isRetryRequest = true;

      try {
        const newToken = await doRefreshToken();

        // 处理队列中的请求
        client.refreshTokenQueue.forEach((callback) => callback(newToken));
        // 清空队列
        client.refreshTokenQueue = [];

        return client.request(error.config.url, { ...error.config });
      } catch (refreshError) {
        // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
        client.refreshTokenQueue.forEach((callback) =>
          callback(null, refreshError),
        );
        client.refreshTokenQueue = [];
        console.error('Refresh token failed, please login again.');
        await doReAuthenticate();

        throw refreshError;
      } finally {
        client.isRefreshing = false;
      }
    },
  };
};

export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn,
): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      const err: string = error?.toString?.() ?? '';
      let errMsg = '';
      if (err?.includes('Network Error')) {
        errMsg = $t('ui.fallback.http.networkError');
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = $t('ui.fallback.http.requestTimeout');
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg, error);
        return Promise.reject(error);
      }

      let errorMessage: string;
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          errorMessage = $t('ui.fallback.http.badRequest');
          break;
        }
        case 401: {
          errorMessage = $t('ui.fallback.http.unauthorized');
          break;
        }
        case 403: {
          errorMessage = $t('ui.fallback.http.forbidden');
          break;
        }
        case 404: {
          errorMessage = $t('ui.fallback.http.notFound');
          break;
        }
        case 408: {
          errorMessage = $t('ui.fallback.http.requestTimeout');
          break;
        }
        default: {
          errorMessage = $t('ui.fallback.http.internalServerError');
        }
      }
      makeErrorMessage?.(errorMessage, error);
      return Promise.reject(error);
    },
  };
};

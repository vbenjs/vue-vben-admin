// 导入类型定义
import type { RequestClient } from './request-client';
import type { MakeErrorMessageFn, ResponseInterceptorConfig } from './types';

// 导入国际化函数
import { $t } from '@vben/locales';
// 导入工具函数，用于判断是否为函数
import { isFunction } from '@vben/utils';

// 导入 Axios HTTP 库
import axios from 'axios';

/**
 * 默认响应拦截器 - 处理成功响应的数据格式统一
 * 主要功能：根据配置提取响应数据中的实际数据部分
 */
export const defaultResponseInterceptor = ({
  codeField = 'code',
  dataField = 'data',
  successCode = 0,
}: {
  /** 响应数据中代表访问结果的字段名，默认为'code' */
  codeField: string;
  /** 响应数据中装载实际数据的字段名，默认为'data'。也可以是一个函数用于自定义数据提取 */
  dataField: ((response: any) => any) | string;
  /** 成功状态码。当codeField字段值等于successCode时表示请求成功。也可以是函数进行自定义判断 */
  successCode: ((code: any) => boolean) | number | string;
}): ResponseInterceptorConfig => {
  return {
    // fulfilled: 请求成功时的处理函数
    fulfilled: (response) => {
      // 从响应对象中提取配置、数据和HTTP状态码
      const { config, data: responseData, status } = response;

      // 如果配置要求返回原始响应，直接返回整个响应对象
      if (config.responseReturn === 'raw') {
        return response;
      }

      // 如果HTTP状态码在200-399之间（表示成功）
      if (status >= 200 && status < 400) {
        // 如果配置要求返回响应体，直接返回响应数据
        if (config.responseReturn === 'body') {
          return responseData;
        }
        // 否则，检查业务状态码是否表示成功
        else if (
          // 如果successCode是函数，调用它判断是否成功
          isFunction(successCode)
            ? successCode(responseData[codeField])
            : // 如果successCode是值，直接比较
              responseData[codeField] === successCode
        ) {
          // 业务成功时，提取实际数据
          return isFunction(dataField)
            ? dataField(responseData) // dataField是函数时，调用它提取数据
            : responseData[dataField]; // dataField是字符串时，直接访问对应字段
        }
      }

      // 如果不满足成功条件，抛出异常，让后续的错误拦截器处理
      throw Object.assign({}, response, { response });
    },
  };
};

/**
 * 认证响应拦截器 - 处理身份认证相关的错误和Token刷新
 * 主要功能：处理401错误、自动刷新Token、重试请求
 */
export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  /** 请求客户端实例 */
  client: RequestClient;
  /** 重新认证函数，通常用于跳转到登录页面 */
  doReAuthenticate: () => Promise<void>;
  /** 刷新Token的函数，返回新的Token */
  doRefreshToken: () => Promise<string>;
  /** 是否启用Token刷新功能 */
  enableRefreshToken: boolean;
  /** Token格式化函数，用于格式化Token字符串 */
  formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
  return {
    // rejected: 请求失败时的处理函数
    rejected: async (error) => {
      // 从错误对象中提取请求配置和响应信息
      const { config, response } = error;

      // 如果不是401错误（未授权），直接抛出异常，不做处理
      if (response?.status !== 401) {
        throw error;
      }

      // 处理401错误的逻辑：
      // 如果没有启用Token刷新功能，或者这已经是一个重试请求，则直接重新认证
      if (!enableRefreshToken || config.__isRetryRequest) {
        await doReAuthenticate(); // 执行重新认证（通常是跳转登录页）
        throw error;
      }

      // 如果当前正在刷新Token，将此请求加入等待队列
      if (client.isRefreshing) {
        return new Promise((resolve) => {
          // 将回调函数加入刷新队列，等待Token刷新完成后执行
          client.refreshTokenQueue.push((newToken: string) => {
            // 使用新Token更新请求头
            config.headers.Authorization = formatToken(newToken);
            // 重新发送原始请求
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      // 开始刷新Token的流程
      client.isRefreshing = true; // 标记正在刷新状态
      config.__isRetryRequest = true; // 标记为重试请求，避免无限循环

      try {
        // 调用刷新Token的函数获取新Token
        const newToken = await doRefreshToken();

        // 处理等待队列中的所有请求，为它们设置新Token
        client.refreshTokenQueue.forEach((callback) => callback(newToken));
        // 清空等待队列
        client.refreshTokenQueue = [];

        // 使用新Token重新发送当前请求
        return client.request(error.config.url, { ...error.config });
      } catch (refreshError) {
        // 如果刷新Token失败，清理队列并重新认证
        client.refreshTokenQueue.forEach((callback) => callback(''));
        client.refreshTokenQueue = [];
        console.error('Token刷新失败，请重新登录。');
        await doReAuthenticate();

        throw refreshError;
      } finally {
        // 无论成功失败，都要清除刷新状态标记
        client.isRefreshing = false;
      }
    },
  };
};

/**
 * 错误消息响应拦截器 - 处理HTTP错误并显示用户友好的错误消息
 * 主要功能：根据HTTP状态码显示对应的错误提示，支持网络错误和超时错误的特殊处理
 */
export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn,
): ResponseInterceptorConfig => {
  return {
    // rejected: 请求失败时的处理函数
    rejected: (error: any) => {
      // 如果是用户主动取消的请求，直接抛出异常，不显示错误消息
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      // 获取错误的字符串表示
      const err: string = error?.toString?.() ?? '';
      let errMsg = '';

      // 特殊错误类型的处理
      if (err?.includes('Network Error')) {
        // 网络错误
        errMsg = $t('ui.fallback.http.networkError');
      } else if (error?.message?.includes?.('timeout')) {
        // 请求超时错误
        errMsg = $t('ui.fallback.http.requestTimeout');
      }

      // 如果是特殊错误类型，显示错误消息并退出
      if (errMsg) {
        makeErrorMessage?.(errMsg, error);
        return Promise.reject(error);
      }

      // 根据HTTP状态码确定错误消息
      let errorMessage = '';
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          // 400 - 请求错误：客户端请求有语法错误或参数错误
          errorMessage = $t('ui.fallback.http.badRequest');
          break;
        }
        case 401: {
          // 401 - 未授权：需要身份认证或认证失败
          errorMessage = $t('ui.fallback.http.unauthorized');
          break;
        }
        case 403: {
          // 403 - 禁止访问：服务器理解请求但拒绝执行
          errorMessage = $t('ui.fallback.http.forbidden');
          break;
        }
        case 404: {
          // 404 - 未找到：服务器找不到请求的资源
          errorMessage = $t('ui.fallback.http.notFound');
          break;
        }
        case 408: {
          // 408 - 请求超时：服务器等待客户端请求超时
          errorMessage = $t('ui.fallback.http.requestTimeout');
          break;
        }
        default: {
          // 其他错误（如500等）- 服务器内部错误
          errorMessage = $t('ui.fallback.http.internalServerError');
        }
      }

      // 调用错误消息处理函数（通常用于显示错误提示）
      makeErrorMessage?.(errorMessage, error);
      // 继续抛出异常，让调用方能够捕获处理
      return Promise.reject(error);
    },
  };
};

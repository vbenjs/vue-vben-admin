/**
 * 该文件可自行根据业务逻辑进行调整
 * 主要功能：配置项目的HTTP请求客户端，包括拦截器、认证处理等
 */
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

// 从环境配置中获取API基础URL
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

/**
 * 创建请求客户端
 * @param baseURL - API基础URL
 * @param options - 可选的客户端配置
 * @returns 配置好的请求客户端实例
 */
function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  // 创建请求客户端实例
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   * 当Token无效或过期时执行，根据配置决定显示登录模态框还是直接退出登录
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();

    // 清除访问令牌
    accessStore.setAccessToken(null);

    // 根据配置决定处理方式：模态框登录或直接退出
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      // 设置登录过期状态，显示登录模态框
      accessStore.setLoginExpired(true);
    } else {
      // 直接退出登录
      await authStore.logout();
    }
  }

  /**
   * 刷新Token逻辑
   * 调用刷新Token的API，获取新的访问令牌并保存到状态中
   * @returns 新的访问令牌
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    // 调用刷新Token的API
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    // 保存新的访问令牌到状态管理中
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  /**
   * 格式化Token
   * @param token - 原始令牌字符串
   * @returns 格式化后的令牌（这里直接返回原始令牌，也可以添加Bearer前缀）
   */
  function formatToken(token: null | string) {
    // 注释掉的代码是Bearer格式，当前项目使用自定义Token头
    // return token ? `Bearer ${token}` : null;
    return token || null;
  }

  // 添加请求拦截器：处理请求头信息
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      // 设置认证Token到请求头（使用自定义头X-Auth-Token而不是标准的Authorization）
      // config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['X-Auth-Token'] = formatToken(accessStore.accessToken);

      // 设置语言偏好到请求头
      config.headers['Accept-Language'] = preferences.app.locale;

      return config;
    },
  });

  const successCodes: Set<string> = new Set([
    'system-0000',
    'system-0001',
    'system-0002',
  ]);

  const isSuccessCode = (code: any): boolean => {
    return successCodes.has(code);
  };

  // 添加默认响应拦截器：统一处理响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code', // 业务状态码字段名
      dataField: 'data', // 实际数据字段名
      successCode: isSuccessCode, // 成功状态码值
    }),
  );

  // 添加认证响应拦截器：处理Token过期和自动刷新
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client, // 当前客户端实例
      doReAuthenticate, // 重新认证函数
      doRefreshToken, // 刷新Token函数
      enableRefreshToken: preferences.app.enableRefreshToken, // 是否启用Token自动刷新
      formatToken, // Token格式化函数
    }),
  );

  // 添加错误消息响应拦截器：统一处理错误提示
  // 如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制，你可以拿到error内的信息进行定制化处理
      // 根据不同的code做不同的提示，而不是直接使用message.error提示msg

      // 当前mock接口返回的错误字段是error或者message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';

      // 优先使用服务端返回的错误信息，如果没有则使用根据状态码生成的提示
      ElMessage.error(errorMessage || msg);
    }),
  );

  return client;
}

// 导出配置好的请求客户端实例，默认返回data字段的数据
export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data', // 只返回响应数据中的data字段
});

// 导出基础请求客户端（未配置拦截器的原始客户端）
export const baseRequestClient = new RequestClient({ baseURL: apiURL });

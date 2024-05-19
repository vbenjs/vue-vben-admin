/**
 * 该文件可自行根据业务逻辑进行调整
 */

import { useAccessStore } from '@vben/stores';
import { message } from 'ant-design-vue';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// 后端需要的 token 存放在header内的key字段
// 可以根据自己的需要修改
const REQUEST_HEADER_TOKEN_KEY = 'Authorization';

type HttpConfig = InternalAxiosRequestConfig;

interface HttpResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

// 用于存储每个请求的标识和取消函数
const pendingMap = new Map<string, AbortController>();

const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url].join('&');
};

/**
 * 添加请求
 * @param config 请求配置
 */
function addRequestSignal(config: AxiosRequestConfig): void {
  abortRequest(config);
  const url = getPendingUrl(config);
  const controller = new AbortController();
  config.signal = config.signal || controller.signal;
  if (!pendingMap.has(url)) {
    // 如果当前请求不在等待中，将其添加到等待中
    pendingMap.set(url, controller);
  }
}

/**
 * 清除所有等待中的请求
 */
function abortAllRequest() {
  pendingMap.forEach((abortController) => {
    if (abortController) {
      abortController.abort();
    }
  });
  pendingMap.clear();
}

/**
 * 移除请求
 * @param config 请求配置
 */
function abortRequest(config: AxiosRequestConfig): void {
  if (!config) {
    return;
  }
  const url = getPendingUrl(config);
  if (pendingMap.has(url)) {
    // 如果当前请求在等待中，取消它并将其从等待中移除
    const abortController = pendingMap.get(url);
    if (abortController) {
      abortController.abort(url);
    }
    pendingMap.delete(url);
  }
}

const axiosInstance = axios.create({
  // .env 环境获取请求地址
  baseURL: import.meta.env.VITE_GLOB_API_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 10 * 1000,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: HttpConfig) => {
    addRequestSignal(config);

    // 携带 getAccessToken 在请求头
    const accessStore = useAccessStore();
    const getAccessToken = accessStore.getAccessToken;

    if (getAccessToken) {
      config.headers[REQUEST_HEADER_TOKEN_KEY] = getAccessToken;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const { data: responseData, status } = response;
    const { code, message: msg, result } = responseData;
    abortRequest(response.config);

    if (status === 200 && code === 0) {
      return result;
    } else {
      message.error(msg);
      throw new Error(msg);
    }
  },
  (error: any) => {
    if (axios.isCancel(error)) {
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

async function request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url,
      ...config,
    });
    return response as T;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
}

export { abortAllRequest, request };

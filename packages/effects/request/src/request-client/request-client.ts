import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';

import { merge } from '@vben/utils';

import axios from 'axios';

import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { FileUploader } from './modules/uploader';
import { type RequestClientOptions } from './types';

class RequestClient {
  private readonly instance: AxiosInstance;

  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];

  public download: FileDownloader['download'];
  // 是否正在刷新token
  public isRefreshing = false;
  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = [];
  public upload: FileUploader['upload'];

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: CreateAxiosDefaults = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      // 默认超时时间
      timeout: 10_000,
    };
    const { ...axiosConfig } = options;
    const requestConfig = merge(axiosConfig, defaultConfig);
    this.instance = axios.create(requestConfig);

    this.bindMethods();

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor =
      interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor =
      interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 实例化文件上传器
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
  }

  private bindMethods() {
    const propertyNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    );
    propertyNames.forEach((propertyName) => {
      const propertyValue = (this as any)[propertyName];
      if (
        typeof propertyValue === 'function' &&
        propertyName !== 'constructor'
      ) {
        (this as any)[propertyName] = propertyValue.bind(this);
      }
    });
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST请求方法
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
      });
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
}

export { RequestClient };

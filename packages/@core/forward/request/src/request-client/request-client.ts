import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

import type { MakeAuthorizationFn, RequestClientOptions } from './types';

import { merge } from '@vben-core/toolkit';

import axios from 'axios';

import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { FileUploader } from './modules/uploader';

class RequestClient {
  private instance: AxiosInstance;
  private makeAuthorization: MakeAuthorizationFn | undefined;
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  public download: FileDownloader['download'];
  public upload: FileUploader['upload'];

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    this.bindMethods();
    // 合并默认配置和传入的配置
    const defaultConfig: CreateAxiosDefaults = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      // 默认超时时间
      timeout: 10_000,
      withCredentials: true,
    };
    const { makeAuthorization, ...axiosConfig } = options;
    const requestConfig = merge(axiosConfig, defaultConfig);

    this.instance = axios.create(requestConfig);
    this.makeAuthorization = makeAuthorization;

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

    // 设置默认的拦截器
    this.setupInterceptors();
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

  private errorHandler(error: any) {
    return Promise.reject(error);
  }

  private setupAuthorizationInterceptor() {
    this.addRequestInterceptor((config: InternalAxiosRequestConfig) => {
      const authorization = this.makeAuthorization?.(config);
      if (authorization) {
        const { token } = authorization.handler?.() ?? {};
        config.headers[authorization.key || 'Authorization'] = token;
      }
      return config;
    }, this.errorHandler);
  }

  private setupInterceptors() {
    // 默认拦截器
    this.setupAuthorizationInterceptor();
  }

  /**
   * DELETE请求方法
   * @param {string} url - 请求的URL
   * @param {AxiosRequestConfig} config - 请求配置（可选）
   * @returns 返回Promise
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   * @param {string} url - 请求URL
   * @param {AxiosRequestConfig} config - 请求配置，可选
   * @returns {Promise<AxiosResponse<T>>} 返回Axios响应Promise
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST请求方法
   * @param {string} url - 请求URL
   * @param {any} data - 请求体数据
   * @param {AxiosRequestConfig} config - 请求配置，可选
   * @returns {Promise<AxiosResponse<T>>} 返回Axios响应Promise
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
   * @param {string} url - 请求的URL
   * @param {any} data - 请求体数据
   * @param {AxiosRequestConfig} config - 请求配置（可选）
   * @returns 返回Promise
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
   * @param {string} url - 请求的URL
   * @param {AxiosRequestConfig} config - 请求配置对象
   * @returns {Promise<AxiosResponse<T>>} 返回Axios响应Promise
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

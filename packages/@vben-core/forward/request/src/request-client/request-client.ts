import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

import { merge } from '@vben-core/toolkit';

import axios from 'axios';

import { AxiosCanceler } from './modules/canceler';
import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { FileUploader } from './modules/uploader';

import type { MakeAuthorizationFn, RequestClientOptions } from './types';

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

  private errorHandler(error: any) {
    return Promise.reject(error);
  }

  private setupAuthorizationInterceptor() {
    this.addRequestInterceptor((config: InternalAxiosRequestConfig) => {
      const authorization = this.makeAuthorization?.(config);
      if (authorization) {
        config.headers[authorization.key || 'Authorization'] =
          authorization.handle?.();
      }
      return config;
    }, this.errorHandler);
  }

  private setupInterceptors() {
    // 默认拦截器
    this.setupAuthorizationInterceptor();
    // 设置取消请求的拦截器
    this.setupCancelerInterceptor();
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

  public setupCancelerInterceptor() {
    const axiosCanceler = new AxiosCanceler();
    // 注册取消重复请求的请求拦截器
    this.addRequestInterceptor((config: InternalAxiosRequestConfig) => {
      return axiosCanceler.addRequest(config);
    }, this.errorHandler);

    // 注册移除请求的响应拦截器
    this.addResponseInterceptor(
      (response: AxiosResponse) => {
        axiosCanceler.removeRequest(response);
        return response;
      },
      (error) => {
        if (error.config) {
          axiosCanceler.removeRequest(error.config);
        }
        return Promise.reject(error);
      },
    );
  }
}

export { RequestClient };

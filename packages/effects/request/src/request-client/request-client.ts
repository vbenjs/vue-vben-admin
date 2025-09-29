// 导入Axios相关类型
import type { AxiosInstance, AxiosResponse } from 'axios';

// 导入自定义类型定义
import type { RequestClientConfig, RequestClientOptions } from './types';

// 导入工具函数
import { bindMethods, isString, merge } from '@vben/utils';

// 导入第三方库
import axios from 'axios';
import qs from 'qs'; // 用于URL参数序列化

// 导入功能模块
import { FileDownloader } from './modules/downloader'; // 文件下载功能
import { InterceptorManager } from './modules/interceptor'; // 拦截器管理
import { FileUploader } from './modules/uploader'; // 文件上传功能

/**
 * 获取参数序列化器
 * 根据传入的序列化类型返回对应的序列化函数
 * @param paramsSerializer - 参数序列化配置
 * @returns 参数序列化函数
 */
function getParamsSerializer(
  paramsSerializer: RequestClientOptions['paramsSerializer'],
) {
  // 如果是字符串类型，根据不同类型返回对应的序列化函数
  if (isString(paramsSerializer)) {
    switch (paramsSerializer) {
      case 'brackets': {
        // 方括号格式: ids[]=1&ids[]=2&ids[]=3
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'brackets' });
      }
      case 'comma': {
        // 逗号分隔格式: ids=1,2,3
        return (params: any) => qs.stringify(params, { arrayFormat: 'comma' });
      }
      case 'indices': {
        // 索引格式: ids[0]=1&ids[1]=2&ids[2]=3
        return (params: any) =>
          qs.stringify(params, { arrayFormat: 'indices' });
      }
      case 'repeat': {
        // 重复格式: ids=1&ids=2&ids=3
        return (params: any) => qs.stringify(params, { arrayFormat: 'repeat' });
      }
    }
  }
  // 如果不是预设类型或者是函数，直接返回
  return paramsSerializer;
}

/**
 * HTTP请求客户端类
 * 封装了Axios实例，提供统一的HTTP请求接口，支持拦截器、文件上传下载等功能
 */
class RequestClient {
  /** 添加请求拦截器的方法 */
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];

  /** 添加响应拦截器的方法 */
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  /** 文件下载方法 */
  public download: FileDownloader['download'];

  /** 是否正在刷新Token的标志位 */
  public isRefreshing = false;
  /** 刷新Token期间的请求队列，存储等待执行的回调函数 */
  public refreshTokenQueue: ((token: string) => void)[] = [];
  /** 文件上传方法 */
  public upload: FileUploader['upload'];
  /** Axios实例，用于实际的HTTP请求 */
  private readonly instance: AxiosInstance;

  /**
   * 构造函数，用于创建Axios实例和初始化各种功能模块
   * @param options - 请求客户端配置选项
   */
  constructor(options: RequestClientOptions = {}) {
    // 定义默认配置
    const defaultConfig: RequestClientOptions = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8', // 默认内容类型
      },
      responseReturn: 'raw', // 默认返回原始响应数据
      timeout: 10_000, // 默认超时时间：10秒
    };

    // 解构传入的配置选项
    const { ...axiosConfig } = options;
    // 合并默认配置和用户配置
    const requestConfig = merge(axiosConfig, defaultConfig);

    // 设置参数序列化器
    requestConfig.paramsSerializer = getParamsSerializer(
      requestConfig.paramsSerializer,
    );

    // 创建Axios实例
    this.instance = axios.create(requestConfig);

    // 绑定方法的this上下文，确保方法调用时this指向正确
    bindMethods(this);

    // 初始化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance);
    // 绑定拦截器方法到当前实例
    this.addRequestInterceptor =
      interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor =
      interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 初始化文件上传功能
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);

    // 初始化文件下载功能
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
  }

  /**
   * DELETE请求方法
   * @param url - 请求URL
   * @param config - 请求配置选项
   * @returns Promise<T> - 返回请求结果的Promise
   */
  public delete<T = any>(
    url: string,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   * @param url - 请求URL
   * @param config - 请求配置选项
   * @returns Promise<T> - 返回请求结果的Promise
   */
  public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST请求方法
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置选项
   * @returns Promise<T> - 返回请求结果的Promise
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * PUT请求方法
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置选项
   * @returns Promise<T> - 返回请求结果的Promise
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * 通用的请求方法 - 所有HTTP请求的核心实现
   * @param url - 请求URL
   * @param config - 请求配置选项
   * @returns Promise<T> - 返回请求结果的Promise
   */
  public async request<T>(
    url: string,
    config: RequestClientConfig,
  ): Promise<T> {
    try {
      // 构建请求配置，如果有自定义的参数序列化器则应用它
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
        // 如果配置中指定了参数序列化器，则使用对应的序列化函数
        ...(config.paramsSerializer
          ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) }
          : {}),
      });

      // 返回响应数据（会经过响应拦截器处理）
      return response as T;
    } catch (error: any) {
      // 如果有响应数据，抛出响应数据；否则抛出原始错误
      // 这里的错误也会被响应拦截器处理
      throw error.response ? error.response.data : error;
    }
  }
}

export { RequestClient };

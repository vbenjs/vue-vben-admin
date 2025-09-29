import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * 扩展选项接口 - 用于扩展Axios的默认配置
 */
type ExtendOptions<T = any> = {
  /**
   * 参数序列化方式。预置的有
   * - brackets: ids[]=1&ids[]=2&ids[]=3    // 方括号形式
   * - comma: ids=1,2,3                     // 逗号分隔形式
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3  // 索引形式
   * - repeat: ids=1&ids=2&ids=3            // 重复参数名形式
   */
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];
  /**
   * 响应数据的返回方式。
   * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
   * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
   * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
/** 请求客户端配置 - 合并Axios配置和扩展选项 */
type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>;

/** 请求响应类型 - 扩展的Axios响应，包含自定义配置 */
type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

/** 请求内容类型枚举 - 常用的HTTP Content-Type */
type RequestContentType =
  | 'application/json;charset=utf-8' // JSON格式
  | 'application/octet-stream;charset=utf-8' // 二进制流
  | 'application/x-www-form-urlencoded;charset=utf-8' // 表单格式
  | 'multipart/form-data;charset=utf-8'; // 文件上传格式

/** 请求客户端选项 - 创建请求客户端时的配置选项 */
type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

/** 请求拦截器配置接口 - 定义请求拦截器的成功和失败回调 */
interface RequestInterceptorConfig {
  /** 请求成功时的处理函数 */
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig<any>)
    | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>;
  /** 请求失败时的处理函数 */
  rejected?: (error: any) => any;
}

/** 响应拦截器配置接口 - 定义响应拦截器的成功和失败回调 */
interface ResponseInterceptorConfig<T = any> {
  /** 响应成功时的处理函数 */
  fulfilled?: (
    response: RequestResponse<T>,
  ) => Promise<RequestResponse> | RequestResponse;
  /** 响应失败时的处理函数 */
  rejected?: (error: any) => any;
}

/** 错误消息处理函数类型 - 用于自定义错误消息的显示方式 */
type MakeErrorMessageFn = (message: string, error: any) => void;

/** HTTP响应接口 - 标准的API响应格式 */
interface HttpResponse<T = any> {
  /**
   * 业务状态码：0 表示成功，其他表示失败
   * Business status code: 0 means success, others means fail
   */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
}

export type {
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
};

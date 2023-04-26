import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from 'axios';

type HttpConfig = InternalAxiosRequestConfig;

interface HttpResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class Http {
  private axiosInstance: AxiosInstance;
  private cancelTokenSource: CancelTokenSource | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10 * 1000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config: HttpConfig) => {
        // 在发送请求之前做些什么
        // 可以在这里添加 loading 等通用操作
        return config as InternalAxiosRequestConfig;
      },
      (error: AxiosError) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      },
    );

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<HttpResponse>) => {
        // 对响应数据做些什么
        const { code, message, data } = response.data;
        if (code === 0) {
          return data;
        } else {
          return Promise.reject(new Error(message));
        }
      },
      (error: AxiosError) => {
        // 对响应错误做些什么
        if (axios.isCancel(error)) {
          console.log('取消请求', error.message);
        } else if (error.response) {
          console.log('请求错误', error.response.data.message);
        } else {
          console.log('请求错误', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  public get<T>(url: string, params?: any, config?: HttpConfig): Promise<T> {
    this.cancelTokenSource = axios.CancelToken.source();
    return this.axiosInstance
      .get<HttpResponse<T>>(url, {
        ...config,
        params,
        cancelToken: this.cancelTokenSource.token,
      })
      .then((res) => res.data.data);
  }

  public post<T>(url: string, data?: any, config?: HttpConfig): Promise<T> {
    this.cancelTokenSource = axios.CancelToken.source();
    return this.axiosInstance
      .post<HttpResponse<T>>(url, data, {
        ...config,
        cancelToken: this.cancelTokenSource.token,
      })
      .then((res) => res.data.data);
  }

  public put<T>(url: string, data?: any, config?: HttpConfig): Promise<T> {
    this.cancelTokenSource = axios.CancelToken.source();
    return this.axiosInstance
      .put<HttpResponse<T>>(url, data, {
        ...config,
        cancelToken: this.cancelTokenSource.token,
      })
      .then((res) => res.data.data);
  }

  public delete<T>(url: string, config?: HttpConfig): Promise<T> {
    this.cancelTokenSource = axios.CancelToken.source();
    return this.axiosInstance
      .delete<HttpResponse<T>>(url, {
        ...config,
        cancelToken: this.cancelTokenSource.token,
      })
      .then((res) => res.data.data);
  }

  public cancelRequest(message?: string) {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel(message);
      this.cancelTokenSource = null;
    }
  }
}

export default Http;

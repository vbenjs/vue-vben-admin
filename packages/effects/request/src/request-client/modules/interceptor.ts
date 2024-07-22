import {
  AxiosInstance,
  AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

const errorHandler = (res: Error) => Promise.reject(res);

class InterceptorManager {
  private axiosInstance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance;
  }

  addRequestInterceptor(
    fulfilled: (
      config: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    rejected?: (error: any) => any,
  ) {
    this.axiosInstance.interceptors.request.use(
      fulfilled,
      rejected || errorHandler,
    );
  }

  addResponseInterceptor<T = any>(
    fulfilled: (
      response: AxiosResponse<T>,
    ) => AxiosResponse | Promise<AxiosResponse>,
    rejected?: (error: any) => any,
  ) {
    this.axiosInstance.interceptors.response.use(
      fulfilled,
      rejected || errorHandler,
    );
  }
}

export { InterceptorManager };

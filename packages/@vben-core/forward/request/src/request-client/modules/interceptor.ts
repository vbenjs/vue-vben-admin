import {
  AxiosInstance,
  AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

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
    this.axiosInstance.interceptors.request.use(fulfilled, rejected);
  }

  addResponseInterceptor(
    fulfilled: (
      response: AxiosResponse,
    ) => AxiosResponse | Promise<AxiosResponse>,
    rejected?: (error: any) => any,
  ) {
    this.axiosInstance.interceptors.response.use(fulfilled, rejected);
  }
}

export { InterceptorManager };

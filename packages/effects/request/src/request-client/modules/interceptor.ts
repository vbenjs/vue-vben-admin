import type { AxiosInstance, AxiosResponse } from 'axios';

import type {
  HttpResponse,
  HttpResponseData,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from '../types';

const defaultRequestInterceptorConfig: RequestInterceptorConfig = {
  fulfilled: (response) => response,
  rejected: (error) => Promise.reject(error),
};

class InterceptorManager {
  private axiosInstance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance;
  }

  addRequestInterceptor({
    fulfilled,
    rejected,
  }: RequestInterceptorConfig = defaultRequestInterceptorConfig) {
    this.axiosInstance.interceptors.request.use(fulfilled, rejected);
  }

  addResponseInterceptor<T extends HttpResponse>({
    fulfilled,
    rejected,
  }: ResponseInterceptorConfig<T>) {
    this.axiosInstance.interceptors.response.use(
      <O extends T>(response: AxiosResponse<O>): HttpResponseData<O> | O => {
        return fulfilled
          ? (fulfilled(response) as HttpResponseData<O> | O)
          : response?.data || response;
      },
      rejected,
    );
  }
}

export { InterceptorManager };

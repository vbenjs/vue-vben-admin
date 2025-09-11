import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';

import type { RequestClient } from '../request-client';
import type { SseRequestOptions } from '../types';

/**
 * SSE模块
 */
class SSE {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async postSSE(
    url: string,
    data?: any,
    requestOptions?: SseRequestOptions,
  ) {
    return this.requestSSE(url, data, {
      ...requestOptions,
      method: 'POST',
    });
  }

  /**
   * SSE请求方法
   * @param url - 请求URL
   * @param data - 请求数据
   * @param requestOptions - SSE请求选项
   */
  public async requestSSE(
    url: string,
    data?: any,
    requestOptions?: SseRequestOptions,
  ) {
    const baseUrl = this.client.getBaseUrl() || '';
    const hasUrlSplit = baseUrl.endsWith('/') && url.startsWith('/');

    const axiosConfig: InternalAxiosRequestConfig = {
      headers: {} as AxiosRequestHeaders,
    };
    const requestInterceptors = this.client.instance.interceptors
      .request as any;
    if (
      requestInterceptors.handlers &&
      requestInterceptors.handlers.length > 0
    ) {
      for (const handler of requestInterceptors.handlers) {
        if (handler.fulfilled) {
          await handler.fulfilled(axiosConfig);
        }
      }
    }

    const requestInit: RequestInit = {
      ...requestOptions,
      body: data,
      headers: {
        ...(axiosConfig.headers as Record<string, string>),
        ...requestOptions?.headers,
      },
    };

    const response = await fetch(
      `${baseUrl}${hasUrlSplit ? '' : '/'}${url}`,
      requestInit,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader');
    }
    let isEnd = false;
    let allMessage = '';
    while (!isEnd) {
      const { done, value } = await reader.read();
      if (done) {
        isEnd = true;
        requestOptions?.onEnd?.(allMessage);
        break;
      }
      const content = decoder.decode(value, { stream: true });
      requestOptions?.onMessage?.(content);
      allMessage += content;
    }
  }
}

export { SSE };

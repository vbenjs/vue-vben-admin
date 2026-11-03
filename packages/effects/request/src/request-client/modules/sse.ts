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

    let axiosConfig: InternalAxiosRequestConfig = {
      url,
      method: (requestOptions?.method as any) ?? 'GET',
      headers: {} as AxiosRequestHeaders,
    };
    const requestInterceptors = this.client.instance.interceptors
      .request as any;
    if (
      requestInterceptors.handlers &&
      requestInterceptors.handlers.length > 0
    ) {
      for (const handler of requestInterceptors.handlers) {
        if (typeof handler?.fulfilled === 'function') {
          const next = await handler.fulfilled(axiosConfig as any);
          if (next) axiosConfig = next as InternalAxiosRequestConfig;
        }
      }
    }

    const merged = new Headers();
    Object.entries(axiosConfig.headers ?? {}).forEach(([k, v]) =>
      merged.set(k, v),
    );
    if (requestOptions?.headers) {
      new Headers(requestOptions.headers).forEach((v, k) => merged.set(k, v));
    }
    if (!merged.has('accept')) {
      merged.set('accept', 'text/event-stream');
    }

    let bodyInit = requestOptions?.body ?? data;
    const ct = (merged.get('content-type') || '').toLowerCase();
    if (
      bodyInit &&
      typeof bodyInit === 'object' &&
      !ArrayBuffer.isView(bodyInit) &&
      !(bodyInit instanceof ArrayBuffer) &&
      !(bodyInit instanceof Blob) &&
      !(bodyInit instanceof FormData) &&
      ct.includes('application/json')
    ) {
      bodyInit = JSON.stringify(bodyInit);
    }
    const requestInit: RequestInit = {
      ...requestOptions,
      method: axiosConfig.method,
      headers: merged,
      body: bodyInit,
    };

    const response = await fetch(safeJoinUrl(baseUrl, url), requestInit);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader');
    }
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        decoder.decode(new Uint8Array(0), { stream: false });
        requestOptions?.onEnd?.();
        reader.releaseLock?.();
        break;
      }
      const content = decoder.decode(value, { stream: true });
      requestOptions?.onMessage?.(content);
    }
  }
}

function safeJoinUrl(baseUrl: string | undefined, url: string): string {
  if (!baseUrl) {
    return url; // 没有 baseUrl，直接返回 url
  }

  // 与 axios 的 isAbsoluteURL 一致：`<scheme>://…` 与 protocol-relative 的 `//…` 都算绝对地址
  if (/^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)) {
    return url;
  }

  // 与 axios 保持一致：空的相对地址直接返回 baseUrl，不做拼接
  if (!url) {
    return baseUrl;
  }

  // 与 axios 保持一致：baseUrl 的路径段属于接口前缀，不能被 URL 解析丢掉
  return `${baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
}

export { SSE };

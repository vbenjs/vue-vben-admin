import type { RawAxiosHeaders, RawAxiosRequestHeaders } from 'axios';

import type { RequestClient } from '../request-client';
import type { RequestClientConfig } from '../types';

import { isUndefined } from '@vben/utils';

import { AxiosHeaders } from 'axios';

class FileUploader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async upload<T = any>(
    url: string,
    data: Record<string, any> & { file: Blob | File },
    config?: RequestClientConfig,
  ): Promise<T> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          !isUndefined(item) && formData.append(`${key}[${index}]`, item);
        });
      } else {
        !isUndefined(value) && formData.append(key, value);
      }
    });

    // headers 可能是 AxiosHeaders 实例（实现了迭代器），对象展开会产出数字键；
    // 先经 AxiosHeaders 归一化为普通对象，再合并默认 Content-Type。
    // axios 的各入口只收 RawAxiosHeaders，而 config.headers 是其扩展记录，边界处收窄。
    const rawHeaders = AxiosHeaders.from(
      config?.headers as RawAxiosHeaders,
    ).toJSON() as RawAxiosRequestHeaders;

    const finalConfig: RequestClientConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...rawHeaders,
      },
    };

    return this.client.post(url, formData, finalConfig);
  }
}

export { FileUploader };

import type { RawAxiosHeaders, RawAxiosRequestHeaders } from 'axios';

import type { RequestClient } from '../request-client';
import type { RequestClientConfig } from '../types';

import { isUndefined } from '@vben/utils';

import { AxiosHeaders } from 'axios';

// headers 的合法形态包括普通对象、AxiosHeaders 实例与 entries 数组等
// 可迭代形态。可迭代形态不能对象展开（会产出数字键），需先经 AxiosHeaders
// 归一化；但 toJSON() 会丢弃 false/null——而它们正是 axios 的「删除实例
// 默认头」哨兵（如 Authorization: false 抑制默认令牌），必须原样存活到
// axios 自己的配置合并。AxiosHeaders 实例本就无法持有 false/null（set
// 即删除），对它做 toJSON 无损；因此仅可迭代形态归一化，普通对象直接
// 浅拷贝保留哨兵。
function normalizeHeaders(
  headers: RequestClientConfig['headers'],
): RawAxiosRequestHeaders {
  if (
    headers &&
    typeof headers === 'object' &&
    !(headers instanceof AxiosHeaders) &&
    !(Symbol.iterator in headers)
  ) {
    return { ...headers };
  }
  // axios 的各入口只收 RawAxiosHeaders，而 config.headers 是其扩展记录，
  // 边界处收窄；AxiosHeaders 实例无法持有 false/null，toJSON() 无损。
  return AxiosHeaders.from(headers as RawAxiosHeaders).toJSON();
}

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

    const finalConfig: RequestClientConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...normalizeHeaders(config?.headers),
      },
    };

    return this.client.post(url, formData, finalConfig);
  }
}

export { FileUploader };

import type { RawAxiosHeaders, RawAxiosRequestHeaders } from 'axios';

import type { RequestClient } from '../request-client';
import type { RequestClientConfig } from '../types';

import { isUndefined } from '@vben/utils';

import { AxiosHeaders } from 'axios';

// headers 的合法形态包括普通对象、AxiosHeaders 实例与 entries 数组等
// 可迭代形态。可迭代形态不能对象展开（会产出数字键），需先经 AxiosHeaders
// 归一化；但 toJSON()/实例迭代器会丢弃 false/null——而它们正是 axios 的
// 「删除实例默认头」哨兵（如 Authorization: false 抑制默认令牌），必须
// 原样存活到 axios 自己的配置合并。axios 1.19.0 的 set()/normalizeValue()
// 会把哨兵原样保留为实例自身属性，因此归一化后拷贝自身属性即可保真；
// 普通对象则直接浅拷贝。
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
  // 边界处收窄。实例与其余可迭代/字符串形态经 from() 归一化后拷贝实例
  // 自身属性——不能走 toJSON()/迭代器，两者都会过滤 false/null 哨兵；
  // 用 Object.assign 而非对象展开，明示拷贝的是自身属性、不经迭代器。
  return Object.assign({}, AxiosHeaders.from(headers as RawAxiosHeaders));
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

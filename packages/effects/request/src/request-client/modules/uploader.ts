import type { RawAxiosHeaders, RawAxiosRequestHeaders } from 'axios';

import type { RequestClient } from '../request-client';
import type { RequestClientConfig } from '../types';

import { isUndefined } from '@vben/utils';

import { AxiosHeaders } from 'axios';

// headers 的合法形态包括普通对象、AxiosHeaders 实例与 entries 数组等
// 可迭代形态。归一化不能经 toJSON()/实例迭代器——两者都过滤 axios 的
// false/null「删除实例默认头」哨兵（如 Authorization: false 抑制默认
// 令牌），而哨兵必须原样存活到 axios 自己的配置合并。axios 1.19.0 的
// set()/normalizeValue() 把哨兵原样保留为实例自身属性，因此对实例
// （含跨 axios 副本、instanceof 不可达的实例）直接拷贝自身属性即可
// 保真；普通对象浅拷贝；数组/字符串等其余形态无哨兵语义，经 from()
// 归一化（注意 from() 对跨副本实例走构造器的迭代分支，同样会丢哨兵）。
function isAxiosHeadersInstance(value: object): boolean {
  // instanceof 只认同一份 axios；原型上的 Symbol.toStringTag 是
  // axios 自身暴露、跨副本稳定的实例标记。
  return (
    value instanceof AxiosHeaders ||
    (value as Record<PropertyKey, unknown>)[Symbol.toStringTag] ===
      'AxiosHeaders'
  );
}

function normalizeHeaders(
  headers: RequestClientConfig['headers'],
): RawAxiosRequestHeaders {
  if (headers && typeof headers === 'object') {
    if (isAxiosHeadersInstance(headers)) {
      // 拷贝自身属性，不经迭代器（会经 toJSON 过滤哨兵）
      return Object.assign({}, headers);
    }
    if (!(Symbol.iterator in headers)) {
      return { ...headers };
    }
  }
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

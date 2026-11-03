import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FileUploader } from './uploader';

describe('fileUploader', () => {
  let fileUploader: FileUploader;
  // Mock the AxiosInstance
  const mockAxiosInstance = {
    post: vi.fn(),
  } as any;

  beforeEach(() => {
    fileUploader = new FileUploader(mockAxiosInstance);
  });

  it('should create an instance of FileUploader', () => {
    expect(fileUploader).toBeInstanceOf(FileUploader);
  });

  it('should upload a file and return the response', async () => {
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const mockResponse: AxiosResponse = {
      config: {} as any,
      data: { success: true },
      headers: {},
      status: 200,
      statusText: 'OK',
    };

    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockResponse);

    const result = await fileUploader.upload(url, { file });
    expect(result).toEqual(mockResponse);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      url,
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });

  it('should merge provided config with default config', async () => {
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const mockResponse: AxiosResponse = {
      config: {} as any,
      data: { success: true },
      headers: {},
      status: 200,
      statusText: 'OK',
    };

    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockResponse);

    const customConfig: AxiosRequestConfig = {
      headers: { 'Custom-Header': 'value' },
    };

    const result = await fileUploader.upload(url, { file }, customConfig);
    expect(result).toEqual(mockResponse);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      url,
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Custom-Header': 'value',
        },
      },
    );
  });

  it('should preserve false-valued header sentinels from plain-object headers', async () => {
    // axios 约定：普通对象里值为 false/null 的头表示「删除实例默认头」
    // （如 Authorization: false 抑制默认令牌），必须在合并时原样透传。
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({} as AxiosResponse);

    await fileUploader.upload(
      url,
      { file },
      { headers: { Authorization: false } },
    );
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      url,
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: false,
        },
      },
    );
  });

  it('should normalize AxiosHeaders instances into a plain header object', async () => {
    // AxiosHeaders 实例实现了迭代器，直接对象展开会产出数字键；
    // 需归一化为普通对象后再合并默认 Content-Type。
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({} as AxiosResponse);

    await fileUploader.upload(
      url,
      { file },
      {
        headers: new AxiosHeaders({ 'X-Custom': 'abc' }),
      },
    );
    // mockAxiosInstance 跨用例共享，取最后一次调用
    const call = (mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>)
      .mock.lastCall?.[2] as { headers: Record<string, unknown> };
    expect(call.headers).toEqual({
      'Content-Type': 'multipart/form-data',
      'X-Custom': 'abc',
    });
    expect(
      Object.keys(call.headers).every((key) => Number.isNaN(Number(key))),
    ).toBe(true);
  });

  it('should preserve false-valued header sentinels from AxiosHeaders instances', async () => {
    // axios 1.19.0 的实例自身属性可持有 false/null 哨兵（set()/
    // normalizeValue() 原样保留），只有 toJSON()/迭代器会过滤它们；
    // 归一化必须浅拷贝实例自身属性，哨兵才能存活到 axios 的配置合并。
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({} as AxiosResponse);

    await fileUploader.upload(
      url,
      { file },
      {
        headers: new AxiosHeaders({
          Authorization: false,
          'X-Null': null,
          'X-Keep': 'value',
        }),
      },
    );
    const call = (mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>)
      .mock.lastCall?.[2] as { headers: Record<string, unknown> };
    expect(call.headers).toEqual({
      'Content-Type': 'multipart/form-data',
      Authorization: false,
      'X-Null': null,
      'X-Keep': 'value',
    });
  });

  it('should preserve false-valued header sentinels from foreign AxiosHeaders instances', async () => {
    // 跨 axios 副本的实例 instanceof 不可达，AxiosHeaders.from() 会把它
    // 送进构造器的迭代分支（经 toJSON 过滤哨兵）；实例原型上的
    // Symbol.toStringTag 是跨副本稳定的标记，须据此走自身属性拷贝。
    // 用独立原型模拟「另一份 axios」：instanceof 失败，但迭代器与
    // toStringTag 行为同真实实例（迭代器经 toJSON 语义过滤哨兵）。
    function makeForeignAxiosHeaders(init: Record<string, unknown>) {
      const proto = {
        *[Symbol.iterator]() {
          for (const entry of Object.entries(init)) {
            const value = entry[1];
            if (value !== null && value !== undefined && value !== false) {
              yield entry;
            }
          }
        },
        get [Symbol.toStringTag]() {
          return 'AxiosHeaders';
        },
      };
      return Object.assign(Object.create(proto), init);
    }

    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({} as AxiosResponse);

    await fileUploader.upload(
      url,
      { file },
      {
        headers: makeForeignAxiosHeaders({
          Authorization: false,
          'X-Null': null,
          'X-Keep': 'value',
        }) as unknown as AxiosRequestConfig['headers'],
      },
    );
    const call = (mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>)
      .mock.lastCall?.[2] as { headers: Record<string, unknown> };
    expect(call.headers).toEqual({
      'Content-Type': 'multipart/form-data',
      Authorization: false,
      'X-Null': null,
      'X-Keep': 'value',
    });
  });

  it('should handle errors gracefully', async () => {
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fileUploader.upload(url, { file })).rejects.toThrow(
      'Network Error',
    );
  });

  it('should handle empty URL gracefully', async () => {
    const url = '';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('Request failed with status code 404'));

    await expect(fileUploader.upload(url, { file })).rejects.toThrow(
      'Request failed with status code 404',
    );
  });

  it('should handle null URL gracefully', async () => {
    const url = null as unknown as string;
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (
      mockAxiosInstance.post as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('Request failed with status code 404'));

    await expect(fileUploader.upload(url, { file })).rejects.toThrow(
      'Request failed with status code 404',
    );
  });
});

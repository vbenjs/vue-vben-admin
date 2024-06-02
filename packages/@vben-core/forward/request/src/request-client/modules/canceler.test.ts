import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AxiosCanceler } from './canceler';

describe('axiosCanceler', () => {
  let axiosCanceler: AxiosCanceler;

  beforeEach(() => {
    axiosCanceler = new AxiosCanceler();
  });

  it('should generate a unique request key', () => {
    const config: AxiosRequestConfig = {
      data: { name: 'test' },
      method: 'get',
      params: { id: 1 },
      url: '/test',
    };
    const requestKey = axiosCanceler.getRequestKey(config);
    expect(requestKey).toBe('get:/test:{"id":1}:{"name":"test"}');
  });

  it('should add a request and create an AbortController', () => {
    const config: InternalAxiosRequestConfig = {
      data: { name: 'test' },
      method: 'get',
      params: { id: 1 },
      url: '/test',
    } as InternalAxiosRequestConfig;

    const updatedConfig = axiosCanceler.addRequest(config);
    expect(updatedConfig.signal).toBeInstanceOf(AbortSignal);
  });

  it('should cancel an existing request if a duplicate is added', () => {
    const config: InternalAxiosRequestConfig = {
      data: { name: 'test' },
      method: 'get',
      params: { id: 1 },
      url: '/test',
    } as InternalAxiosRequestConfig;

    axiosCanceler.addRequest(config);
    const controller = axiosCanceler.pending.get(
      'get:/test:{"id":1}:{"name":"test"}',
    );
    expect(controller).toBeDefined();

    if (controller) {
      const spy = vi.spyOn(controller, 'abort');

      axiosCanceler.addRequest(config);
      expect(spy).toHaveBeenCalled();
    }
  });

  it('should remove a request', () => {
    const config: AxiosRequestConfig = {
      data: { name: 'test' },
      method: 'get',
      params: { id: 1 },
      url: '/test',
    };

    axiosCanceler.addRequest(config as InternalAxiosRequestConfig);
    axiosCanceler.removeRequest(config);
    expect(axiosCanceler.pending.size).toBe(0);
  });

  it('should remove all pending requests', () => {
    const config1: InternalAxiosRequestConfig = {
      data: { name: 'test1' },
      method: 'get',
      params: { id: 1 },
      url: '/test1',
    } as InternalAxiosRequestConfig;

    const config2: InternalAxiosRequestConfig = {
      data: { name: 'test2' },
      method: 'get',
      params: { id: 2 },
      url: '/test2',
    } as InternalAxiosRequestConfig;

    axiosCanceler.addRequest(config1);
    axiosCanceler.addRequest(config2);

    axiosCanceler.removeAllPending();
    expect(axiosCanceler.pending.size).toBe(0);
  });

  it('should handle empty config gracefully', () => {
    const config = {} as InternalAxiosRequestConfig;
    const updatedConfig = axiosCanceler.addRequest(config);
    expect(updatedConfig.signal).toBeInstanceOf(AbortSignal);
  });

  it('should handle undefined params and data gracefully', () => {
    const config: InternalAxiosRequestConfig = {
      method: 'get',
      url: '/test',
    } as InternalAxiosRequestConfig;

    const requestKey = axiosCanceler.getRequestKey(config);
    expect(requestKey).toBe('get:/test:{}:{}');
  });

  it('should not abort if no controller exists for the request key', () => {
    const config: InternalAxiosRequestConfig = {
      data: { name: 'test' },
      method: 'get',
      params: { id: 1 },
      url: '/test',
    } as InternalAxiosRequestConfig;

    const requestKey = axiosCanceler.getRequestKey(config);
    const spy = vi.spyOn(AbortController.prototype, 'abort');

    axiosCanceler.addRequest(config);
    axiosCanceler.pending.delete(requestKey);
    axiosCanceler.addRequest(config);

    expect(spy).not.toHaveBeenCalled();
  });
});

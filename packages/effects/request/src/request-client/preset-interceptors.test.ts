import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  authenticateResponseInterceptor,
  idempotencyRequestInterceptor,
} from './preset-interceptors';
import { RequestClient } from './request-client';

describe('authenticateResponseInterceptor', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  function createClient(
    doRefreshToken: () => Promise<string>,
    getToken: () => null | string = () => null,
  ) {
    const client = new RequestClient();
    const reAuthenticate = vi.fn(async () => {});
    // Applications attach the current token in a request interceptor, which is
    // also how the retried request picks up the refreshed token.
    client.addRequestInterceptor({
      fulfilled: (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
    });
    client.addResponseInterceptor(
      authenticateResponseInterceptor({
        client,
        doReAuthenticate: reAuthenticate,
        doRefreshToken,
        enableRefreshToken: true,
        formatToken: (token) => (token ? `Bearer ${token}` : null),
      }),
    );
    return { client, reAuthenticate };
  }

  it('fails the queued requests when the token refresh fails', async () => {
    const refreshToken = vi.fn(
      () =>
        new Promise<string>((_resolve, reject) => {
          setTimeout(() => {
            reject(new Error('refresh failed'));
          }, 100);
        }),
    );
    const { client, reAuthenticate } = createClient(refreshToken);

    const calls: string[] = [];
    mock.onGet('/initiator').reply(() => {
      calls.push('/initiator');
      return [401];
    });
    // Arrives while the refresh is still in flight, so it waits in the queue.
    mock.onGet('/queued').reply(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            calls.push('/queued');
            resolve([401]);
          }, 20);
        }),
    );

    const results = await Promise.allSettled([
      client.get('/initiator'),
      client.get('/queued'),
    ]);

    expect(results.map((result) => result.status)).toEqual([
      'rejected',
      'rejected',
    ]);
    // One failed refresh must not start another one from the queue, and every
    // queued request must fail instead of being replayed without a token.
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(reAuthenticate).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['/initiator', '/queued']);
  });

  it('replays the queued requests with the refreshed token', async () => {
    let currentToken: null | string = null;
    const refreshToken = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            currentToken = 'new-token';
            resolve('new-token');
          }, 100);
        }),
    );
    const { client, reAuthenticate } = createClient(
      refreshToken,
      () => currentToken,
    );

    const initiatorHeaders: (null | string)[] = [];
    const queuedHeaders: (null | string)[] = [];

    mock.onGet('/initiator').reply((config) => {
      const authorization = (config.headers?.Authorization as string) ?? null;
      initiatorHeaders.push(authorization);
      return authorization === 'Bearer new-token' ? [200, {}] : [401];
    });
    mock.onGet('/queued').reply((config) => {
      const authorization = (config.headers?.Authorization as string) ?? null;
      queuedHeaders.push(authorization);
      if (authorization === 'Bearer new-token') {
        return [200, {}];
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve([401]), 20);
      });
    });

    await Promise.all([client.get('/initiator'), client.get('/queued')]);

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(reAuthenticate).not.toHaveBeenCalled();
    expect(initiatorHeaders).toEqual([null, 'Bearer new-token']);
    expect(queuedHeaders).toEqual([null, 'Bearer new-token']);
  });

  it('does not start a second refresh when a replayed queued request fails again', async () => {
    let currentToken: null | string = null;
    const refreshToken = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            currentToken = 'new-token';
            resolve('new-token');
          }, 100);
        }),
    );
    const { client, reAuthenticate } = createClient(
      refreshToken,
      () => currentToken,
    );

    const queuedHeaders: (null | string)[] = [];
    mock.onGet('/initiator').reply((config) => {
      return config.headers?.Authorization === 'Bearer new-token'
        ? [200, {}]
        : [401];
    });
    // This endpoint keeps answering 401 even with the refreshed token, so its
    // replay must count as a retry instead of opening another refresh cycle.
    mock.onGet('/queued').reply((config) => {
      queuedHeaders.push((config.headers?.Authorization as string) ?? null);
      return new Promise((resolve) => {
        setTimeout(() => resolve([401]), 20);
      });
    });

    const results = await Promise.allSettled([
      client.get('/initiator'),
      client.get('/queued'),
    ]);

    expect(results.map((result) => result.status)).toEqual([
      'fulfilled',
      'rejected',
    ]);
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(queuedHeaders).toEqual([null, 'Bearer new-token']);
    expect(reAuthenticate).toHaveBeenCalledTimes(1);
  });
});

describe('idempotencyRequestInterceptor', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  function recordHeader(headerName = 'Idempotency-Key') {
    const keys: (null | string)[] = [];
    mock.onAny().reply((config) => {
      keys.push((config.headers?.[headerName] as string) ?? null);
      return [200, {}];
    });
    return keys;
  }

  it('attaches a generated key to non-idempotent methods only', async () => {
    const client = new RequestClient();
    client.addRequestInterceptor(idempotencyRequestInterceptor());
    const keys = recordHeader();

    await client.post('/order', {});
    await client.put('/order', {});
    await client.request('/order', { method: 'PATCH' });
    await client.delete('/order');
    await client.get('/order');

    expect(keys).toEqual([
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      null,
    ]);
    expect(new Set(keys).size).toBe(5);
  });

  it('falls back to getRandomValues outside secure contexts', async () => {
    // Browsers omit crypto.randomUUID on plain http pages.
    vi.stubGlobal('crypto', {
      getRandomValues: globalThis.crypto.getRandomValues.bind(
        globalThis.crypto,
      ),
    });
    try {
      const client = new RequestClient();
      client.addRequestInterceptor(idempotencyRequestInterceptor());
      const keys = recordHeader();

      await client.post('/order', {});
      await client.post('/order', {});

      expect(keys).toEqual([
        expect.stringMatching(/^[0-9a-f]{32}$/),
        expect.stringMatching(/^[0-9a-f]{32}$/),
      ]);
      expect(keys[0]).not.toBe(keys[1]);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('respects the per-request idempotencyKey option', async () => {
    const client = new RequestClient();
    client.addRequestInterceptor(idempotencyRequestInterceptor());
    const keys = recordHeader();

    await client.post('/order', {}, { idempotencyKey: 'order-1' });
    await client.post('/order', {}, { idempotencyKey: false });
    await client.get('/order', { idempotencyKey: true });
    await client.post(
      '/order',
      {},
      { headers: { 'Idempotency-Key': 'from-header' } },
    );

    expect(keys).toEqual(['order-1', null, expect.any(String), 'from-header']);
  });

  it('supports custom header name, methods and key generator', async () => {
    const client = new RequestClient();
    client.addRequestInterceptor(
      idempotencyRequestInterceptor({
        generateKey: () => 'custom-key',
        headerName: 'X-Request-Id',
        methods: ['post'],
      }),
    );
    const keys = recordHeader('X-Request-Id');

    await client.post('/order', {});
    await client.put('/order', {});

    expect(keys).toEqual(['custom-key', null]);
  });

  it('only attaches explicit keys when methods is empty', async () => {
    const client = new RequestClient();
    client.addRequestInterceptor(
      idempotencyRequestInterceptor({ methods: [] }),
    );
    const keys = recordHeader();

    await client.post('/order', {});
    await client.post('/order', {}, { idempotencyKey: true });

    expect(keys).toEqual([null, expect.any(String)]);
  });

  it('reuses the same key when the request is replayed after a token refresh', async () => {
    let currentToken: null | string = null;
    const client = new RequestClient();
    client.addRequestInterceptor({
      fulfilled: (config) => {
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
    });
    client.addRequestInterceptor(idempotencyRequestInterceptor());
    client.addResponseInterceptor(
      authenticateResponseInterceptor({
        client,
        doReAuthenticate: vi.fn(async () => {}),
        doRefreshToken: async () => {
          currentToken = 'new-token';
          return currentToken;
        },
        enableRefreshToken: true,
        formatToken: (token) => (token ? `Bearer ${token}` : null),
      }),
    );

    const keys: string[] = [];
    mock.onPost('/order').reply((config) => {
      keys.push(config.headers?.['Idempotency-Key'] as string);
      return config.headers?.Authorization === 'Bearer new-token'
        ? [200, {}]
        : [401];
    });

    await client.post('/order', {});

    expect(keys).toHaveLength(2);
    expect(keys[0]).toEqual(expect.any(String));
    expect(keys[1]).toBe(keys[0]);
  });
});

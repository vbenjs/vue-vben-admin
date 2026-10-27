import { describe, expect, it, vi } from 'vitest';

import { VxeGridApi } from '../api';
import { extendProxyOptions } from '../extends';

const FORM_VALUES = { category: 'cat-42' };

type QueryFn = (
  params: Record<string, unknown>,
  formValues: Record<string, unknown>,
) => Promise<unknown> | unknown;

function createApi(query: QueryFn) {
  return new VxeGridApi({
    gridOptions: { proxyConfig: { ajax: { query } } },
  });
}

function currentQuery(api: VxeGridApi): QueryFn | undefined {
  const query = api.state?.gridOptions?.proxyConfig?.ajax?.query;
  return typeof query === 'function' ? (query as QueryFn) : undefined;
}

function wrap(api: VxeGridApi) {
  extendProxyOptions(api, api.state?.gridOptions ?? {}, () => ({
    ...FORM_VALUES,
  }));
}

describe('extendProxyOptions', () => {
  it('is idempotent: wrapping the same options twice keeps a single wrapper', () => {
    const original = vi.fn();
    const api = createApi(original);

    wrap(api);
    const firstWrapper = currentQuery(api);
    expect(firstWrapper).not.toBe(original);
    expect(firstWrapper).toBeTypeOf('function');

    wrap(api);
    expect(currentQuery(api)).toBe(firstWrapper);
  });

  it('wraps callbacks installed by setGridOptions after the setup-time wrapping', async () => {
    const original = vi.fn();
    const replacement = vi.fn().mockResolvedValue({ total: 0 });
    const api = createApi(original);

    // setup-time wrapping
    wrap(api);

    // parent replaces the callback (e.g. setGridOptions in its onMounted)
    api.setGridOptions({ proxyConfig: { ajax: { query: replacement } } });
    expect(currentQuery(api)).toBe(replacement);

    // init-time re-wrap after the option update
    wrap(api);
    const wrapped = currentQuery(api);
    expect(wrapped).not.toBe(replacement);
    expect(wrapped).toBeTypeOf('function');
    if (!wrapped) {
      throw new Error('expected the replacement to be wrapped');
    }

    // the replacement receives the merged form values
    await wrapped({}, {});
    expect(replacement).toHaveBeenCalledOnce();
    expect(replacement.mock.calls[0]?.[1]).toEqual(FORM_VALUES);
    expect(original).not.toHaveBeenCalled();

    // and re-wrapping again stays idempotent
    wrap(api);
    expect(currentQuery(api)).toBe(wrapped);
  });
});

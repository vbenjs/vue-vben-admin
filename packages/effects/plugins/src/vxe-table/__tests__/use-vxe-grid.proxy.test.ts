import { createApp, defineComponent, h, nextTick } from 'vue';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useVbenVxeGrid } from '../use-vxe-grid';

// 不 mock '@vben/hooks' 与 '../extends'：这里需要走真实的优先级解析
// （prop 优先于 state）与真实的 proxy 包装逻辑。

const mockRefs = vi.hoisted(() => ({
  isMobile: undefined as any,
}));
const observedAjax = vi.hoisted(
  () => [] as Array<Record<string, any> | undefined>,
);
const formApiRefs = vi.hoisted(() => ({ latest: null as any }));

vi.mock('@vben/preferences', async () => {
  const { ref } = await import('vue');
  const isMobile = ref(false);
  mockRefs.isMobile = isMobile;
  return { usePreferences: () => ({ isMobile }) };
});

vi.mock('@vben/icons', async () => {
  const { defineComponent, h } = await import('vue');
  return {
    EmptyIcon: defineComponent(() => () => h('span')),
  };
});

vi.mock('@vben/locales', () => ({ $t: (key: string) => key }));

vi.mock('@vben-core/shadcn-ui', async () => {
  const { defineComponent, h } = await import('vue');
  const Stub = defineComponent(
    (_, { slots }) =>
      () =>
        h('div', slots.default?.()),
  );
  return { VbenHelpTooltip: Stub, VbenLoading: Stub };
});

vi.mock('vxe-pc-ui', async () => {
  const { defineComponent, h } = await import('vue');
  return { VxeButton: defineComponent(() => () => h('button')) };
});

vi.mock('vxe-table', async () => {
  const { defineComponent, h } = await import('vue');

  return {
    VxeGrid: defineComponent({
      inheritAttrs: false,
      setup(_, { attrs }) {
        return () => {
          observedAjax.push((attrs.proxyConfig as any)?.ajax);
          return h('div');
        };
      },
    }),
    VxeUI: { getConfig: () => ({ grid: {} }) },
  };
});

vi.mock('../init', async () => {
  const { defineComponent, h } = await import('vue');
  const Form = defineComponent(() => () => h('form'));
  return {
    // 每次挂载创建独立的 formApi，避免跨挂载共享 mock 掩盖旧闭包问题
    useTableForm: () => {
      const formApi = {
        getLatestSubmissionValues: vi.fn(() => ({})),
        getState: vi.fn(() => ({ compact: true })),
        getValues: vi.fn(async () => ({})),
        reset: vi.fn(),
        setLatestSubmissionValues: vi.fn(),
        setState: vi.fn(),
        unmount: vi.fn(),
      };
      formApiRefs.latest = formApi;
      return [Form, formApi];
    },
  };
});

vi.mock('../viewed-row', () => ({
  applyViewedRowOptions: vi.fn(),
  useViewedRow: vi.fn(),
}));

function mountRender(render: () => any) {
  const Consumer = defineComponent({ render });
  const host = document.createElement('div');
  document.body.append(host);
  const app = createApp(Consumer);
  app.mount(host);
  return { app, host };
}

async function flushGridInit() {
  await nextTick();
  await nextTick();
  await nextTick();
}

function renderedQuery() {
  const query = observedAjax.at(-1)?.query;
  expect(query).toBeTypeOf('function');
  if (typeof query !== 'function') {
    throw new TypeError('expected the rendered query to be a function');
  }
  return query;
}

describe('vben vxe grid proxy ajax wrapping', () => {
  beforeEach(() => {
    mockRefs.isMobile.value = false;
    observedAjax.length = 0;
  });

  it('wraps ajax callbacks supplied through the gridOptions prop without mutating the prop', async () => {
    const original = vi.fn().mockResolvedValue({ total: 0 });
    const propGridOptions = {
      pagerConfig: {},
      proxyConfig: { ajax: { query: original } },
    };
    const [Grid] = useVbenVxeGrid({ gridOptions: {} });
    const { app, host } = mountRender(() =>
      h(Grid, { gridOptions: propGridOptions } as any),
    );

    try {
      await flushGridInit();
      // prop 优先级高于 state，state 里的包装器会被遮蔽：
      // 传给 VxeGrid 的必须是包装后的回调
      const query = renderedQuery();
      expect(query).not.toBe(original);
      // 父组件的 prop 未被修改
      expect(propGridOptions.proxyConfig?.ajax?.query).toBe(original);

      // 包装后的回调注入当前表单值
      formApiRefs.latest.getLatestSubmissionValues.mockReturnValue({
        category: 'cat-42',
      });
      await query({ page: 1 }, {});
      expect(original).toHaveBeenCalledOnce();
      expect(original).toHaveBeenCalledWith(
        { page: 1 },
        { category: 'cat-42' },
      );

      // 无关选项变化触发重算时，包装器引用保持稳定
      mockRefs.isMobile.value = true;
      await nextTick();
      await nextTick();
      expect(observedAjax.at(-1)?.query).toBe(query);
    } finally {
      app.unmount();
      host.remove();
    }
  });

  it('wraps ajax callbacks replaced via api.setGridOptions after init', async () => {
    const original = vi.fn().mockResolvedValue({ total: 0 });
    const replacement = vi.fn().mockResolvedValue({ total: 1 });
    const [Grid, api] = useVbenVxeGrid({
      gridOptions: { proxyConfig: { ajax: { query: original } } },
    });
    const { app, host } = mountRender(() => h(Grid));

    try {
      await flushGridInit();

      api.setGridOptions({ proxyConfig: { ajax: { query: replacement } } });
      await nextTick();
      await nextTick();

      // state 与最终传给 VxeGrid 的选项拿到的是同一个包装器
      const query = renderedQuery();
      expect(query).not.toBe(replacement);
      expect(api.state?.gridOptions?.proxyConfig?.ajax?.query).toBe(query);

      formApiRefs.latest.getLatestSubmissionValues.mockReturnValue({
        category: 'cat-42',
      });
      await query({}, {});
      expect(replacement).toHaveBeenCalledOnce();
      expect(replacement).toHaveBeenCalledWith({}, { category: 'cat-42' });
      expect(original).not.toHaveBeenCalled();
    } finally {
      app.unmount();
      host.remove();
    }
  });

  it('rebinds form values to the current mount when the same grid remounts', async () => {
    const original = vi.fn().mockResolvedValue({ total: 0 });
    const [Grid] = useVbenVxeGrid({
      gridOptions: { proxyConfig: { ajax: { query: original } } },
    });

    const first = mountRender(() => h(Grid));
    await flushGridInit();
    const firstQuery = renderedQuery();
    first.app.unmount();
    first.host.remove();

    const second = mountRender(() => h(Grid));
    try {
      await flushGridInit();
      const secondQuery = renderedQuery();
      // 同一 api 复用同一包装器（不嵌套）
      expect(secondQuery).toBe(firstQuery);
      // 但读取的是当前挂载的表单值
      formApiRefs.latest.getLatestSubmissionValues.mockReturnValue({
        mount: 2,
      });
      await secondQuery({}, {});
      expect(original).toHaveBeenCalledOnce();
      expect(original).toHaveBeenCalledWith({}, { mount: 2 });
    } finally {
      second.app.unmount();
      second.host.remove();
    }
  });
});

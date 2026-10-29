import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import VbenVxeGrid from '../use-vxe-grid.vue';

const mockRefs = vi.hoisted(() => ({
  gridOptions: undefined as any,
  isMobile: undefined as any,
}));
const observedColumns = vi.hoisted(() => [] as unknown[]);
const observedToolbarConfigs = vi.hoisted(() => [] as unknown[]);
const observedData = vi.hoisted(() => [] as unknown[]);
const extendProxyOptionsMock = vi.hoisted(() => vi.fn());

vi.mock('@vben/hooks', async () => {
  const { ref } = await import('vue');
  const gridOptions = ref({
    columns: [
      {
        field: 'operation',
        fixed: 'right',
        width: 'auto',
      },
    ],
  });
  mockRefs.gridOptions = gridOptions;

  return {
    usePriorityValues: () => ({
      class: ref(undefined),
      formOptions: ref(undefined),
      gridClass: ref(undefined),
      gridEvents: ref(undefined),
      gridOptions,
      separator: ref(undefined),
      showSearchForm: ref(true),
      tableData: ref(undefined),
      tableTitle: ref(undefined),
      tableTitleHelp: ref(undefined),
      viewedRowOptions: ref(undefined),
    }),
  };
});

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
      setup(_, { attrs, slots }) {
        return () => {
          observedColumns.push(attrs.columns);
          observedToolbarConfigs.push(attrs.toolbarConfig);
          observedData.push(attrs.data);
          return h('div', [
            slots['toolbar-actions']?.({}),
            slots['toolbar-tools']?.({}),
          ]);
        };
      },
    }),
    VxeUI: { getConfig: () => ({ grid: {} }) },
  };
});

vi.mock('../extends', async (importOriginal) => ({
  // wrapProxyAjaxOptions 保持真实实现：组件在 options computed 中用它
  // 就地包装最终传给 VxeGrid 的选项（真实路径需要被覆盖）。
  ...(await importOriginal<Record<string, unknown>>()),
  extendProxyOptions: extendProxyOptionsMock,
}));

vi.mock('../init', async () => {
  const { defineComponent, h } = await import('vue');
  return {
    useTableForm: () => [
      defineComponent(() => () => h('form')),
      {
        getLatestSubmissionValues: vi.fn(),
        getState: vi.fn(() => ({ compact: true })),
        getValues: vi.fn(async () => ({})),
        reset: vi.fn(),
        setLatestSubmissionValues: vi.fn(),
        setState: vi.fn(),
        unmount: vi.fn(),
      },
    ],
  };
});

vi.mock('../viewed-row', () => ({
  applyViewedRowOptions: vi.fn(),
  useViewedRow: vi.fn(),
}));

function createGridApi(commitProxy = vi.fn()) {
  return {
    grid: { commitProxy },
    mount: vi.fn(),
    reload: vi.fn(),
    setState: vi.fn(),
    toggleSearchForm: vi.fn(),
    unmount: vi.fn(),
    useStore: vi.fn(() => ({})),
  };
}

async function flushGridInit() {
  await nextTick();
  await nextTick();
  await nextTick();
}

describe('vben vxe grid reactivity', () => {
  beforeEach(() => {
    mockRefs.gridOptions.value = {
      columns: [
        {
          field: 'operation',
          fixed: 'right',
          width: 'auto',
        },
      ],
    };
    mockRefs.isMobile.value = false;
    observedColumns.length = 0;
    observedToolbarConfigs.length = 0;
    observedData.length = 0;
    extendProxyOptionsMock.mockClear();
  });

  it.each(['table-title', 'toolbar-actions', 'toolbar-tools'])(
    'keeps toolbar options stable when the %s slot updates',
    async (slotName) => {
      const loading = ref(false);
      const api = createGridApi();
      const Consumer = defineComponent(
        () => () =>
          h(VbenVxeGrid, { api } as any, {
            [slotName]: () =>
              h(
                'span',
                { 'data-slot-state': '' },
                loading.value ? 'loading' : 'idle',
              ),
          }),
      );
      const host = document.createElement('div');
      document.body.append(host);
      const app: App = createApp(Consumer);

      try {
        app.mount(host);
        await nextTick();
        await nextTick();

        expect(host.querySelector('[data-slot-state]')?.textContent).toBe(
          'idle',
        );
        const initialToolbarConfig = observedToolbarConfigs.at(-1);

        loading.value = true;
        await nextTick();
        await nextTick();

        expect(host.querySelector('[data-slot-state]')?.textContent).toBe(
          'loading',
        );
        expect(observedToolbarConfigs.at(-1)).toBe(initialToolbarConfig);
      } finally {
        app.unmount();
        host.remove();
      }
    },
  );

  it('keeps columns stable when unrelated grid options update', async () => {
    mockRefs.gridOptions.value = {
      columns: [{ field: 'name' }],
      pagerConfig: {},
    };
    const api = createGridApi();
    const Consumer = defineComponent(
      () => () => h(VbenVxeGrid, { api } as any),
    );
    const host = document.createElement('div');
    document.body.append(host);
    const app: App = createApp(Consumer);

    try {
      app.mount(host);
      await flushGridInit();
      const initialColumns = observedColumns.at(-1);

      mockRefs.isMobile.value = true;
      await nextTick();
      await nextTick();

      expect(observedColumns.at(-1)).toBe(initialColumns);
    } finally {
      app.unmount();
      host.remove();
    }
  });

  it('keeps data stable when unrelated grid options update', async () => {
    mockRefs.gridOptions.value = {
      columns: [{ field: 'name' }],
      data: [{ name: 'row-1' }],
      pagerConfig: {},
    };
    const api = createGridApi();
    const Consumer = defineComponent(
      () => () => h(VbenVxeGrid, { api } as any),
    );
    const host = document.createElement('div');
    document.body.append(host);
    const app: App = createApp(Consumer);

    try {
      app.mount(host);
      await flushGridInit();
      const initialData = observedData.at(-1);

      mockRefs.isMobile.value = true;
      await nextTick();
      await nextTick();

      expect(observedData.at(-1)).toBe(initialData);
    } finally {
      app.unmount();
      host.remove();
    }
  });

  it('uses the initial action for the first proxy load', async () => {
    mockRefs.gridOptions.value = {
      columns: [{ field: 'name', sortable: true }],
      proxyConfig: {
        ajax: { query: vi.fn() },
        autoLoad: true,
      },
      sortConfig: {
        defaultSort: { field: 'name', order: 'asc' },
      },
    };
    const commitProxy = vi.fn();
    const api = createGridApi(commitProxy);
    const Consumer = defineComponent(
      () => () => h(VbenVxeGrid, { api } as any),
    );
    const host = document.createElement('div');
    document.body.append(host);
    const app: App = createApp(Consumer);

    try {
      app.mount(host);
      await flushGridInit();

      expect(api.setState).toHaveBeenCalledOnce();
      // wrapped twice: once during setup (before mount) and once in init()
      // after the initial option update, so callbacks installed by a parent
      // (e.g. setGridOptions in its onMounted) are wrapped as well.
      expect(extendProxyOptionsMock).toHaveBeenCalledTimes(2);
      expect(commitProxy).toHaveBeenCalledOnce();
      expect(commitProxy).toHaveBeenCalledWith('initial', {});
      const mountCallOrder = api.mount.mock.invocationCallOrder[0];
      const setStateCallOrder = api.setState.mock.invocationCallOrder[0];
      const setupWrapCallOrder =
        extendProxyOptionsMock.mock.invocationCallOrder[0];
      const initRewrapCallOrder =
        extendProxyOptionsMock.mock.invocationCallOrder[1];
      const commitProxyCallOrder = commitProxy.mock.invocationCallOrder[0];
      if (
        mountCallOrder === undefined ||
        setStateCallOrder === undefined ||
        setupWrapCallOrder === undefined ||
        initRewrapCallOrder === undefined ||
        commitProxyCallOrder === undefined
      ) {
        throw new Error('Expected all initialization calls to be recorded');
      }
      // setup-time wrapping happens before mount, so any query()/reload()
      // after mount goes through the wrapper regardless of init()'s async
      // timing.
      expect(setupWrapCallOrder).toBeLessThan(mountCallOrder);
      // init re-wraps after the option update and before the initial commit.
      expect(setStateCallOrder).toBeLessThan(initRewrapCallOrder);
      expect(initRewrapCallOrder).toBeLessThan(commitProxyCallOrder);
    } finally {
      app.unmount();
      host.remove();
    }
  });

  it('re-wraps ajax callbacks replaced after init', async () => {
    mockRefs.gridOptions.value = {
      proxyConfig: {
        ajax: { query: vi.fn() },
        autoLoad: true,
      },
    };
    const api = createGridApi();
    const Consumer = defineComponent(
      () => () => h(VbenVxeGrid, { api } as any),
    );
    const host = document.createElement('div');
    document.body.append(host);
    const app: App = createApp(Consumer);

    try {
      app.mount(host);
      await flushGridInit();
      // setup-time wrap + init-time re-wrap
      expect(extendProxyOptionsMock).toHaveBeenCalledTimes(2);

      // api.setGridOptions() replaces the query callback after init
      mockRefs.gridOptions.value = {
        proxyConfig: { ajax: { query: vi.fn() } },
      };
      await nextTick();
      await nextTick();

      expect(extendProxyOptionsMock).toHaveBeenCalledTimes(3);
    } finally {
      app.unmount();
      host.remove();
    }
  });
});

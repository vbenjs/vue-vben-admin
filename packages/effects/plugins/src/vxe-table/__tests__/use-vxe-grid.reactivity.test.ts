import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import VbenVxeGrid from '../use-vxe-grid.vue';

const observedToolbarConfigs = vi.hoisted(() => [] as unknown[]);

vi.mock('@vben/hooks', async () => {
  const { ref } = await import('vue');

  return {
    usePriorityValues: () => ({
      class: ref(undefined),
      formOptions: ref(undefined),
      gridClass: ref(undefined),
      gridEvents: ref(undefined),
      gridOptions: ref({
        columns: [
          {
            field: 'operation',
            fixed: 'right',
            width: 'auto',
          },
        ],
      }),
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
  return { usePreferences: () => ({ isMobile: ref(false) }) };
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
  const Stub = defineComponent((_, { slots }) => () => h('div', slots.default?.()));
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
          observedToolbarConfigs.push(attrs.toolbarConfig);
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

vi.mock('../extends', () => ({ extendProxyOptions: vi.fn() }));

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

describe('vben vxe grid toolbar slots', () => {
  it.each(['table-title', 'toolbar-actions', 'toolbar-tools'])(
    'keeps toolbar options stable when the %s slot updates',
    async (slotName) => {
      observedToolbarConfigs.length = 0;
      const loading = ref(false);
      const api = {
        grid: { commitProxy: vi.fn() },
        mount: vi.fn(),
        reload: vi.fn(),
        setState: vi.fn(),
        toggleSearchForm: vi.fn(),
        unmount: vi.fn(),
        useStore: vi.fn(() => ({})),
      };
      const Consumer = defineComponent(() => () =>
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
});

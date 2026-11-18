import type { App, Ref } from 'vue';

import { createApp, defineComponent, h, KeepAlive, nextTick, ref } from 'vue';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VbenVxeGrid from '../use-vxe-grid.vue';

const activeRefs = vi.hoisted(() => ({
  current: {} as Record<string, Ref>,
}));

const mockRefs = vi.hoisted(() => ({
  formOptions: undefined as any,
  formClass: undefined as any,
  gridClass: undefined as any,
  gridOptions: undefined as any,
  sectionOptions: undefined as any,
  segmented: undefined as any,
  separator: undefined as any,
  showSearchForm: undefined as any,
}));

vi.mock('@vben/hooks', async () => {
  const { ref } = await import('vue');

  return {
    usePriorityValues: () => {
      const refs = {
        class: ref(undefined),
        formClass: ref(mockRefs.formClass),
        formOptions: ref(mockRefs.formOptions),
        gridClass: ref(mockRefs.gridClass),
        gridEvents: ref(undefined),
        gridOptions: ref(mockRefs.gridOptions),
        sectionOptions: ref(mockRefs.sectionOptions),
        segmented: ref(mockRefs.segmented),
        separator: ref(mockRefs.separator),
        showSearchForm: ref(mockRefs.showSearchForm ?? true),
        tableData: ref(undefined),
        tableTitle: ref(undefined),
        tableTitleHelp: ref(undefined),
        viewedRowOptions: ref(undefined),
      };
      activeRefs.current = refs;
      return refs;
    },
  };
});

vi.mock('@vben/preferences', async () => {
  const { ref } = await import('vue');
  const isMobile = ref(false);
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

// 根节点保留 attrs 透传,便于断言分段标记与 CSS 变量;渲染 form slot
vi.mock('vxe-table', async () => {
  const { defineComponent, h } = await import('vue');

  return {
    VxeGrid: defineComponent({
      setup(_, { slots }) {
        return () =>
          h('div', { class: 'vxe-grid' }, [
            slots.form?.({}),
            slots.top &&
              h('div', { class: 'vxe-grid--top-wrapper' }, slots.top({})),
            slots.bottom &&
              h('div', { class: 'vxe-grid--bottom-wrapper' }, slots.bottom({})),
          ]);
      },
    }),
    VxeUI: { getConfig: () => ({ grid: {} }) },
  };
});

vi.mock('../extends', () => ({
  extendProxyOptions: vi.fn(),
  wrapProxyAjaxOptions: vi.fn(),
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

function createGridApi() {
  return {
    grid: { commitProxy: vi.fn(), recalculate: vi.fn() },
    mount: vi.fn(),
    reload: vi.fn(),
    setState: vi.fn(),
    toggleSearchForm: vi.fn(),
    unmount: vi.fn(),
    useStore: vi.fn(() => ({})),
  };
}

const cleanups = new Set<() => void>();

async function mountGrid(keepAlive = false) {
  const api = createGridApi();
  const visible = ref(true);
  const host = document.createElement('div');
  document.body.append(host);
  const app: App = createApp(
    defineComponent(() => () => {
      if (keepAlive) {
        return h(KeepAlive, null, {
          default: () => {
            if (visible.value) {
              return h(VbenVxeGrid, { api } as any);
            }
            return null;
          },
        });
      }
      return h(VbenVxeGrid, { api } as any);
    }),
  );
  app.mount(host);
  for (let i = 0; i < 4; i++) {
    await nextTick();
  }
  const gridEl = host.querySelector<HTMLElement>('.vxe-grid');
  const cleanup = () => {
    app.unmount();
    host.remove();
    cleanups.delete(cleanup);
  };
  cleanups.add(cleanup);
  return {
    api,
    cleanup,
    gridEl,
    host,
    outer: host.firstElementChild as HTMLElement,
    visible,
  };
}

const resizeObservers: ResizeObserverStub[] = [];
const animationFrames = new Map<number, FrameRequestCallback>();
let nextFrameId = 0;

class ResizeObserverStub {
  targets = new Set<Element>();

  constructor(private callback: ResizeObserverCallback) {
    resizeObservers.push(this);
  }

  disconnect() {
    this.targets.clear();
  }

  emit(target: Element) {
    this.callback(
      [{ target } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }

  observe(target: Element) {
    this.targets.add(target);
  }
}

async function flushLayoutFrame() {
  await nextTick();
  const callbacks = [...animationFrames.values()];
  animationFrames.clear();
  for (const callback of callbacks) {
    callback(0);
  }
  await nextTick();
}

function queryShell(container: ParentNode) {
  return container.querySelector<HTMLElement>('.flow-root');
}

function queryStrip(container: ParentNode) {
  return container.querySelector<HTMLElement>('[aria-hidden="true"]');
}

function refOf(key: keyof typeof activeRefs.current) {
  const ref = activeRefs.current[key];
  if (!ref) {
    throw new Error(`missing ref: ${key}`);
  }
  return ref;
}

function requireObserver(observers: ResizeObserverStub[], target: Element) {
  const observer = observers.find(({ targets }) => targets.has(target));
  if (!observer) {
    throw new Error('observer not found for target');
  }
  return observer;
}

function req(el: HTMLElement | null | undefined): HTMLElement {
  if (!el) {
    throw new Error('expected element to exist');
  }
  return el;
}

function getSurface(shell: HTMLElement) {
  return shell.firstElementChild as HTMLElement;
}

function getZone(shell: HTMLElement) {
  return shell.children.item(1) as HTMLElement;
}

describe('vben vxe grid segmented rendering', () => {
  beforeEach(() => {
    resizeObservers.length = 0;
    animationFrames.clear();
    nextFrameId = 0;
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const id = ++nextFrameId;
      animationFrames.set(id, callback);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      animationFrames.delete(id);
    });
    mockRefs.formClass = undefined;
    mockRefs.formOptions = { wrapperClass: 'x' };
    mockRefs.gridClass = undefined;
    mockRefs.gridOptions = { columns: [{ field: 'id' }] };
    mockRefs.sectionOptions = undefined;
    mockRefs.segmented = undefined;
    mockRefs.separator = undefined;
    mockRefs.showSearchForm = true;
  });

  afterEach(() => {
    for (const cleanup of cleanups) {
      cleanup();
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the default band structure with a uniform 8px rhythm', async () => {
    const { cleanup, gridEl } = await mountGrid();
    expect(gridEl).toBeTruthy();

    const shell = queryShell(req(gridEl));
    expect(shell).toBeTruthy();

    // 默认表面补底部内边距,顶部由 grid p-2 提供。
    expect(getSurface(req(shell)).className).toBe('pb-2');
    expect(gridEl?.className).toContain('p-2');

    // 分隔条:文档流、装饰性、通栏色带(贴紧,间距由表单尾部提供)
    const strip = queryStrip(req(shell));
    expect(strip).toBeTruthy();
    expect(strip?.className).toBe('bg-background-deep h-2');

    // 默认形态不下发分段标记
    expect(gridEl?.dataset.vbenGridSectioned).toBeUndefined();
    // 搜索页没有工具栏,仍通过可测量的 Top wrapper 留出表头间距。
    expect(gridEl?.dataset.vbenGridTopInset).toBe('true');
    expect(gridEl?.querySelector('.vxe-grid--top-wrapper')).toBeTruthy();

    cleanup();
  });

  it('hides the separator while preserving surface padding', async () => {
    mockRefs.separator = false;
    const { cleanup, gridEl } = await mountGrid();

    const shell = req(queryShell(req(gridEl)));
    expect(queryStrip(shell)).toBeNull();
    // 隐藏时不渲染分隔占位元素,尾部空间由表面提供
    expect(shell.children.length).toBe(1);
    expect(getSurface(req(shell)).className).toBe('pb-2');
    expect(gridEl?.dataset.vbenGridTopInset).toBeUndefined();
    expect(gridEl?.querySelector('.vxe-grid--top-wrapper')).toBeNull();

    cleanup();
  });

  it('applies zone mode presets without a default separator', async () => {
    mockRefs.segmented = 'zone';
    const { cleanup, gridEl } = await mountGrid();

    const shell = req(queryShell(req(gridEl)));
    expect(getSurface(shell).className).toContain('bg-background-deep');
    expect(getSurface(req(shell)).className).toContain(
      'rounded-[var(--radius)]',
    );

    // zone 默认隐藏分隔条(面板色差即分隔,避免与表格头边线形成双线)
    expect(queryStrip(shell)).toBeNull();
    expect(shell.children.length).toBe(1);

    expect(gridEl?.dataset.vbenGridSectioned).toBe('zone');
    // zone 模式默认不写下段变量(保持现状外观)
    expect(gridEl?.getAttribute('style')).toBeFalsy();

    cleanup();
  });

  it('shows the zone hairline when explicitly enabled', async () => {
    mockRefs.segmented = 'zone';
    mockRefs.separator = true;
    const { cleanup, gridEl } = await mountGrid();

    const shell = queryShell(req(gridEl));
    expect(queryStrip(req(shell))?.className).toBe('h-px bg-border');
    expect(shell?.children.length).toBe(2);

    cleanup();
  });

  it('applies card mode presets with section vars and gap zone', async () => {
    mockRefs.segmented = 'card';
    const { cleanup, gridEl, outer } = await mountGrid();

    // 外层透明化,两段各为独立卡片
    expect(outer.className).toContain('bg-transparent');
    // 根节点 padding 归零:卡片与其他布局占据相同外廓
    expect(gridEl?.className).toContain('p-0');

    const shell = queryShell(req(gridEl));
    expect(getSurface(req(shell)).className).toContain('bg-card');

    // card 默认无分隔条,分隔区承载两卡间距
    expect(queryStrip(req(shell))).toBeNull();
    expect(getZone(req(shell)).style.height).toContain(
      '--vben-grid-section-gap',
    );

    // 根节点变量与分段标记
    const style = gridEl?.getAttribute('style') ?? '';
    expect(gridEl?.dataset.vbenGridSectioned).toBe('card');
    expect(style).toContain('--vben-grid-body-background: hsl(var(--card))');
    expect(style).toContain('--vben-grid-body-radius: var(--radius)');
    expect(style).toContain('--vben-grid-fullscreen-bg');
    expect(style).toContain('--vben-grid-section-gap: 0.5rem');

    cleanup();
  });

  it('shows the card separator only with explicit show and splits the gap', async () => {
    mockRefs.segmented = 'card';
    mockRefs.separator = { class: 'h-2', show: true };
    const { cleanup, gridEl } = await mountGrid();

    const shell = queryShell(req(gridEl));
    expect(getZone(req(shell)).style.paddingBlock).toContain(
      'calc(var(--vben-grid-section-gap, 0.5rem) / 2)',
    );

    const strip = queryStrip(req(shell));
    expect(strip?.className).toContain('h-2');
    // 用户 class 覆盖预设 h-px
    expect(strip?.className).not.toContain('h-px');

    cleanup();
  });

  it('applies explicit sectionOptions.form as surface style', async () => {
    mockRefs.segmented = 'zone';
    mockRefs.sectionOptions = {
      form: { backgroundColor: 'teal', borderRadius: '10px' },
    };
    const { cleanup, gridEl } = await mountGrid();

    const surface = getSurface(req(queryShell(req(gridEl))));
    expect(surface.style.backgroundColor).toBe('teal');
    expect(surface.style.borderRadius).toBe('10px');

    cleanup();
  });

  it('respects showSearchForm=false by hiding the whole shell', async () => {
    mockRefs.showSearchForm = false;
    const { cleanup, gridEl } = await mountGrid();

    const shell = queryShell(req(gridEl));
    expect(shell).toBeTruthy();
    expect(shell?.style.display).toBe('none');

    cleanup();
  });

  it('measures asymmetric padding independently on both sides', async () => {
    const { gridEl } = await mountGrid();
    const root = req(gridEl);
    root.style.paddingLeft = '12px';
    root.style.paddingRight = '24px';
    await flushLayoutFrame();

    const shell = req(queryShell(root));
    expect(
      shell.style.getPropertyValue('--vben-grid-separator-bleed-left'),
    ).toBe('12px');
    expect(
      shell.style.getPropertyValue('--vben-grid-separator-bleed-right'),
    ).toBe('24px');

    root.style.paddingLeft = '20px';
    root.style.paddingRight = '4px';
    refOf('gridClass').value = 'pl-5 pr-1';
    await flushLayoutFrame();
    expect(
      shell.style.getPropertyValue('--vben-grid-separator-bleed-left'),
    ).toBe('20px');
    expect(
      shell.style.getPropertyValue('--vben-grid-separator-bleed-right'),
    ).toBe('4px');
  });

  it('observes forms created after mount and rebinds after replacement', async () => {
    mockRefs.formOptions = undefined;
    const { api, gridEl } = await mountGrid();
    await flushLayoutFrame();
    expect(queryShell(req(gridEl))).toBeNull();

    refOf('formOptions').value = {};
    await flushLayoutFrame();
    const firstShell = req(queryShell(req(gridEl)));
    const observer = requireObserver(resizeObservers, firstShell);
    expect(observer).toBeDefined();
    api.grid.recalculate.mockClear();
    observer.emit(firstShell);
    await flushLayoutFrame();
    expect(api.grid.recalculate).toHaveBeenCalledExactlyOnceWith(true);

    refOf('formOptions').value = undefined;
    await flushLayoutFrame();
    expect(observer.targets.size).toBe(0);
    refOf('formOptions').value = {};
    await flushLayoutFrame();
    const secondShell = req(queryShell(req(gridEl)));
    expect(secondShell).not.toBe(firstShell);
    expect(observer.targets.has(secondShell)).toBe(true);

    api.grid.recalculate.mockClear();
    observer.emit(firstShell);
    await flushLayoutFrame();
    expect(api.grid.recalculate).not.toHaveBeenCalled();
    observer.emit(secondShell);
    await flushLayoutFrame();
    expect(api.grid.recalculate).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('skips cosmetic updates and coalesces geometry changes into one frame', async () => {
    mockRefs.segmented = 'card';
    const { api, gridEl } = await mountGrid();
    await flushLayoutFrame();
    api.grid.recalculate.mockClear();

    refOf('sectionOptions').value = {
      body: { backgroundColor: 'teal', borderRadius: '16px' },
      form: { backgroundColor: 'pink', borderRadius: '16px' },
    };
    refOf('separator').value = { backgroundColor: 'red' };
    await flushLayoutFrame();
    expect(api.grid.recalculate).not.toHaveBeenCalled();

    refOf('sectionOptions').value = { gap: '16px' };
    await nextTick();
    const shell = req(queryShell(req(gridEl)));
    const observer = requireObserver(resizeObservers, shell);
    observer.emit(shell);
    observer.emit(shell);
    await flushLayoutFrame();
    expect(api.grid.recalculate).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('pauses observers in KeepAlive and cancels pending work on unmount', async () => {
    const { api, cleanup, gridEl, visible } = await mountGrid(true);
    await flushLayoutFrame();
    const shell = req(queryShell(req(gridEl)));
    const observer = requireObserver(resizeObservers, shell);
    api.grid.recalculate.mockClear();
    observer.emit(shell);

    visible.value = false;
    await nextTick();
    expect(resizeObservers.every(({ targets }) => targets.size === 0)).toBe(
      true,
    );
    expect(animationFrames.size).toBe(0);
    await flushLayoutFrame();
    expect(api.grid.recalculate).not.toHaveBeenCalled();

    visible.value = true;
    await flushLayoutFrame();
    expect(observer.targets.has(shell)).toBe(true);
    expect(api.grid.recalculate).toHaveBeenCalledExactlyOnceWith(true);

    api.grid.recalculate.mockClear();
    observer.emit(shell);
    cleanup();
    expect(animationFrames.size).toBe(0);
    expect(resizeObservers.every(({ targets }) => targets.size === 0)).toBe(
      true,
    );
    await flushLayoutFrame();
    expect(api.grid.recalculate).not.toHaveBeenCalled();
  });

  it('warns on layouts that violate the segmented contract', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockRefs.segmented = 'card';
    mockRefs.gridOptions = {
      columns: [{ field: 'id' }],
      layouts: [['Form'], ['Table'], ['Pager']],
    };
    const { cleanup } = await mountGrid();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('footer layout must be empty'),
    );

    warn.mockRestore();
    cleanup();
  });
});

import type { App } from 'vue';

import { computed, createApp, defineComponent, h } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';

import LayoutSidebar from '../components/layout-sidebar.vue';

vi.mock('@vben-core/composables', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@vben-core/composables')>();
  return {
    ...actual,
    useScrollLock: () => computed({ get: () => false, set: () => {} }),
  };
});

vi.mock('../hooks/use-sidebar-drag', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../hooks/use-sidebar-drag')>();
  return {
    ...actual,
    useSidebarDrag: () => ({ startDrag: vi.fn(), endDrag: vi.fn() }),
  };
});

const MIXED_WIDTH = 80;
const EXTRA_WIDTH = 224;

let activeApp: App | undefined;

interface MountOptions {
  collapse?: boolean;
  /** 偏好 sidebar.expandOnHover，vben-layout 同时把它绑到 expandOnHover 与 fixedExtra */
  expandOnHover?: boolean;
  expandOnHovering?: boolean;
  extraVisible?: boolean;
  fixedExtra?: boolean;
}

function mountSidebar(options: MountOptions = {}) {
  const expandOnHover = options.expandOnHover ?? true;
  const Consumer = defineComponent(
    () => () =>
      h(LayoutSidebar, {
        collapse: options.collapse ?? false,
        expandOnHover,
        expandOnHovering: options.expandOnHovering ?? false,
        extraCollapse: false,
        extraVisible: options.extraVisible ?? false,
        extraWidth: EXTRA_WIDTH,
        fixedExtra: options.fixedExtra ?? expandOnHover,
        headerHeight: 50,
        isSidebarMixed: true,
        mixedWidth: MIXED_WIDTH,
        theme: 'dark',
        themeSub: 'dark',
        width: MIXED_WIDTH,
      }),
  );
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp(Consumer);
  activeApp.mount(host);
}

/** 占位元素（flex 流里撑开正文的那个 div）预留的宽度 */
function getPlaceholderWidth(): number {
  const placeholder = [...document.querySelectorAll('div')].find(
    (el) => (el as HTMLElement).style.flexBasis !== '',
  );
  if (!placeholder) {
    throw new TypeError('placeholder not rendered');
  }
  return Number.parseFloat((placeholder as HTMLElement).style.flexBasis);
}

/** 二级面板自身渲染出的宽度 */
function getExtraPanelWidth(): number {
  // 面板的定位来自 class（fixed），内联样式只有 left/width/z-index
  const panel = [...document.querySelectorAll('aside > div')].find((el) =>
    el.classList.contains('fixed'),
  );
  if (!panel) {
    throw new TypeError('extra panel not rendered');
  }
  return Number.parseFloat((panel as HTMLElement).style.width);
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

/**
 * 面板宽度与占位宽度必须同源：vben-layout 的 header/正文偏移只看 sidebarExtraVisible，
 * 两者不一致时面板就会浮在正文上。固定模式下面板展开即占位；悬停模式下面板是浮层，
 * 占位恒为一级列宽（且只在悬停期间渲染）。
 */
describe('layout-sidebar extra panel (#双列菜单遮挡正文)', () => {
  it('固定模式：有二级菜单时展开并占位', () => {
    mountSidebar({ expandOnHover: true, extraVisible: true });

    expect(getExtraPanelWidth()).toBe(EXTRA_WIDTH);
    expect(getPlaceholderWidth()).toBe(MIXED_WIDTH + EXTRA_WIDTH);
  });

  it('调用方只传 expandOnHover 不传 fixedExtra 时面板仍能展开', () => {
    mountSidebar({
      expandOnHover: true,
      extraVisible: true,
      fixedExtra: false,
    });

    expect(getExtraPanelWidth()).toBe(EXTRA_WIDTH);
    expect(getPlaceholderWidth()).toBe(MIXED_WIDTH + EXTRA_WIDTH);
  });

  it('固定模式：页面不属于任何菜单时整列收起，不遮挡正文', () => {
    mountSidebar({ expandOnHover: true, extraVisible: false });

    expect(getExtraPanelWidth()).toBe(0);
    expect(getPlaceholderWidth()).toBe(MIXED_WIDTH);
  });

  it('悬停模式：未悬停时即使 extraVisible 残留为真也不渲染面板', () => {
    mountSidebar({
      expandOnHover: false,
      expandOnHovering: false,
      extraVisible: true,
    });

    expect(getExtraPanelWidth()).toBe(0);
    expect(getPlaceholderWidth()).toBe(MIXED_WIDTH);
  });

  it('悬停模式：悬停中作为浮层展开，不挤占正文', () => {
    mountSidebar({
      expandOnHover: false,
      expandOnHovering: true,
      extraVisible: true,
    });

    expect(getExtraPanelWidth()).toBe(EXTRA_WIDTH);
    expect(getPlaceholderWidth()).toBe(MIXED_WIDTH);
  });

  it('折叠时不渲染面板也不占位', () => {
    mountSidebar({ collapse: true, expandOnHover: true, extraVisible: true });

    expect(getExtraPanelWidth()).toBe(0);
    expect(getPlaceholderWidth()).toBe(MIXED_WIDTH);
  });
});

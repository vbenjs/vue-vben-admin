import type { App } from 'vue';

import { computed, createApp, defineComponent, h, nextTick, ref } from 'vue';

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

let activeApp: App | undefined;

interface MountOptions {
  collapse?: boolean;
  isMobile?: boolean;
}

/**
 * 挂载一个受控的 LayoutSidebar，验证移动端/桌面端 hover 事件对折叠状态的副作用（#8274）。
 */
function mountSidebar(options: MountOptions = {}) {
  const collapse = ref(options.collapse ?? false);
  const collapseWrites: boolean[] = [];
  const onUpdateCollapse = vi.fn((value: boolean) => {
    collapseWrites.push(value);
    collapse.value = value;
  });
  const Consumer = defineComponent(
    () => () =>
      h(LayoutSidebar, {
        collapse: collapse.value,
        expandOnHover: false,
        expandOnHovering: false,
        extraCollapse: false,
        extraVisible: false,
        theme: 'dark',
        themeSub: 'dark',
        width: 180,
        headerHeight: 50,
        extraWidth: 60,
        isMobile: options.isMobile ?? false,
        'onUpdate:collapse': onUpdateCollapse,
      }),
  );
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp(Consumer);
  activeApp.mount(host);
  return { collapseWrites, onUpdateCollapse };
}

function getAside(): HTMLElement {
  const aside = document.querySelector('aside');
  if (!(aside instanceof HTMLElement)) {
    throw new TypeError('aside not rendered');
  }
  return aside;
}

async function fireMouse(type: 'mouseenter' | 'mouseleave') {
  const event = new MouseEvent(type);
  // jsdom 的合成事件 offsetX 恒为 0，会命中 handleMouseenter 的左边缘 10px 守卫；
  // 注入 20 模拟真实悬停在菜单区
  Object.defineProperty(event, 'offsetX', { value: 20 });
  getAside().dispatchEvent(event);
  await nextTick();
  await nextTick();
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('layout-sidebar mobile hover guard (#8274)', () => {
  it('mobile: mouseleave must not write collapsed state', async () => {
    const { collapseWrites, onUpdateCollapse } = await mountSidebar({
      isMobile: true,
    });

    await fireMouse('mouseleave');

    expect(collapseWrites).toHaveLength(0);
    expect(onUpdateCollapse).not.toHaveBeenCalled();
  });

  it('mobile: mouseenter must not write collapsed state', async () => {
    const { collapseWrites, onUpdateCollapse } = await mountSidebar({
      isMobile: true,
    });

    await fireMouse('mouseenter');

    expect(collapseWrites).toHaveLength(0);
    expect(onUpdateCollapse).not.toHaveBeenCalled();
  });

  it('desktop: mouseleave still collapses the hover-expanded rail', async () => {
    const { collapseWrites, onUpdateCollapse } = await mountSidebar({
      isMobile: false,
    });

    await fireMouse('mouseleave');

    expect(collapseWrites).toContain(true);
    expect(onUpdateCollapse).toHaveBeenCalledWith(true);
  });

  it('desktop: mouseenter expands a collapsed rail (collapse=false)', async () => {
    const { collapseWrites, onUpdateCollapse } = await mountSidebar({
      isMobile: false,
      collapse: true,
    });

    await fireMouse('mouseenter');

    expect(collapseWrites).toContain(false);
    expect(onUpdateCollapse).toHaveBeenCalledWith(false);
  });
});

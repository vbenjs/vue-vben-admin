import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, onMounted } from 'vue';

import { ELEMENT_ID_MAIN_CONTENT } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useVbenDrawer } from '../use-drawer';

vi.mock('@vben-core/preferences', () => ({
  usePreferences: () => ({
    globalEscapeShortcutKey: { value: true },
  }),
}));

let activeApp: App | undefined;

interface MountOptions {
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

/**
 * 挂载一个受控的 Drawer 组件，用于验证鼠标点击与键盘交互后的关闭行为和事件副作用。
 */
async function mountDrawer(options: MountOptions = {}) {
  const mainContent = document.createElement('main');
  mainContent.id = ELEMENT_ID_MAIN_CONTENT;
  mainContent.innerHTML = '<div><div></div></div>';
  document.body.append(mainContent);

  let capturedApi: ReturnType<typeof useVbenDrawer>[1] | undefined;
  const Consumer = defineComponent(() => {
    const [Drawer, drawerApi] = useVbenDrawer({
      appendToMain: true,
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      closeOnClickModal: options.closeOnClickModal ?? true,
      closeOnPressEscape: options.closeOnPressEscape ?? true,
      title: 'Interaction drawer',
      ...(options.onCancel ? { onCancel: options.onCancel } : {}),
      ...(options.onConfirm ? { onConfirm: options.onConfirm } : {}),
    });
    capturedApi = drawerApi;
    onMounted(() => {
      drawerApi.open();
    });
    return () => h(Drawer);
  });
  const host = document.createElement('div');
  document.body.append(host);

  activeApp = createApp(() => h(Consumer));
  activeApp.mount(host);
  await nextTick();
  await nextTick();
  // reka-ui 在 setTimeout(0) 之后才把 document 级的 pointerdown 监听挂上，
  // 等待一个宏任务，确保遮罩交互在监听器就绪后触发。
  await new Promise((resolve) => setTimeout(resolve, 0));

  if (!capturedApi) {
    throw new Error('drawer api was not captured');
  }
  return { drawerApi: capturedApi };
}

function buttonByText(text: string): HTMLElement | undefined {
  return [...document.querySelectorAll('button')].find(
    (element) => element.textContent?.trim() === text,
  );
}

function pressEscape() {
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    }),
  );
}

function pointerDownOverlay() {
  const overlay = document.querySelector('[data-dismissable-drawer]');
  if (!(overlay instanceof HTMLElement)) {
    return false;
  }
  overlay.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
  );
  return true;
}

async function settle() {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 80));
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('vben drawer interactions', () => {
  it('fires confirm exactly once on confirm click and does not auto-close', async () => {
    const onConfirm = vi.fn();
    const { drawerApi } = await mountDrawer({ onConfirm });
    const button = buttonByText('Confirm');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(drawerApi.store.state.isOpen).toBe(true);
  });

  it('closes the drawer when the confirm handler closes the api', async () => {
    const onConfirm = vi.fn();
    const apiRef: {
      current?: ReturnType<typeof useVbenDrawer>[1];
    } = {};
    const { drawerApi } = await mountDrawer({
      onConfirm: () => {
        onConfirm();
        void apiRef.current?.close();
      },
    });
    apiRef.current = drawerApi;
    const button = buttonByText('Confirm');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    await expect.poll(() => drawerApi.store.state.isOpen).toBe(false);
  });

  it('closes on cancel click when no cancel hook is provided', async () => {
    const { drawerApi } = await mountDrawer();
    const button = buttonByText('Cancel');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await expect.poll(() => drawerApi.store.state.isOpen).toBe(false);
  });

  it('fires cancel exactly once and does not auto-close when a cancel hook exists', async () => {
    const onCancel = vi.fn();
    const { drawerApi } = await mountDrawer({ onCancel });
    const button = buttonByText('Cancel');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(drawerApi.store.state.isOpen).toBe(true);
  });

  it('closes when Escape is pressed', async () => {
    const { drawerApi } = await mountDrawer();

    pressEscape();

    await expect.poll(() => drawerApi.store.state.isOpen).toBe(false);
  });

  it('stays open on Escape when closeOnPressEscape is false', async () => {
    const { drawerApi } = await mountDrawer({ closeOnPressEscape: false });

    pressEscape();
    await settle();

    expect(drawerApi.store.state.isOpen).toBe(true);
  });

  it('closes when the dismissable overlay is pointer-downed', async () => {
    const { drawerApi } = await mountDrawer();

    expect(pointerDownOverlay()).toBe(true);
    await expect.poll(() => drawerApi.store.state.isOpen).toBe(false);
  });

  it('stays open on overlay pointer-down when closeOnClickModal is false', async () => {
    const { drawerApi } = await mountDrawer({ closeOnClickModal: false });

    expect(pointerDownOverlay()).toBe(true);
    await settle();

    expect(drawerApi.store.state.isOpen).toBe(true);
  });
});

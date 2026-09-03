import type { App } from 'vue';

import { createApp, defineComponent, h, nextTick, onMounted } from 'vue';

import { ELEMENT_ID_MAIN_CONTENT } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useVbenModal } from '../use-modal';

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
 * 挂载一个受控的 Modal 组件，用于验证鼠标点击与键盘交互后的关闭行为和事件副作用。
 */
async function mountModal(options: MountOptions = {}) {
  const mainContent = document.createElement('main');
  mainContent.id = ELEMENT_ID_MAIN_CONTENT;
  mainContent.innerHTML = '<div><div></div></div>';
  document.body.append(mainContent);

  let capturedApi: ReturnType<typeof useVbenModal>[1] | undefined;
  const Consumer = defineComponent(() => {
    const [Modal, modalApi] = useVbenModal({
      appendToMain: true,
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      closeOnClickModal: options.closeOnClickModal ?? true,
      closeOnPressEscape: options.closeOnPressEscape ?? true,
      title: 'Interaction modal',
      ...(options.onCancel ? { onCancel: options.onCancel } : {}),
      ...(options.onConfirm ? { onConfirm: options.onConfirm } : {}),
    });
    capturedApi = modalApi;
    onMounted(() => {
      modalApi.open();
    });
    return () => h(Modal);
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
    throw new Error('modal api was not captured');
  }
  return { modalApi: capturedApi };
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
  const overlay = document.querySelector('[data-dismissable-modal]');
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

describe('vben modal interactions', () => {
  it('fires confirm exactly once on confirm click and does not auto-close', async () => {
    const onConfirm = vi.fn();
    const { modalApi } = await mountModal({ onConfirm });
    const button = buttonByText('Confirm');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(modalApi.store.state.isOpen).toBe(true);
  });

  it('closes the modal when the confirm handler closes the api', async () => {
    const onConfirm = vi.fn();
    const apiRef: {
      current?: ReturnType<typeof useVbenModal>[1];
    } = {};
    const { modalApi } = await mountModal({
      onConfirm: () => {
        onConfirm();
        void apiRef.current?.close();
      },
    });
    apiRef.current = modalApi;
    const button = buttonByText('Confirm');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    await expect.poll(() => modalApi.store.state.isOpen).toBe(false);
  });

  it('closes on cancel click when no cancel hook is provided', async () => {
    const { modalApi } = await mountModal();
    const button = buttonByText('Cancel');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await expect.poll(() => modalApi.store.state.isOpen).toBe(false);
  });

  it('fires cancel exactly once and does not auto-close when a cancel hook exists', async () => {
    const onCancel = vi.fn();
    const { modalApi } = await mountModal({ onCancel });
    const button = buttonByText('Cancel');

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(modalApi.store.state.isOpen).toBe(true);
  });

  it('closes when Escape is pressed', async () => {
    const { modalApi } = await mountModal();

    pressEscape();

    await expect.poll(() => modalApi.store.state.isOpen).toBe(false);
  });

  it('stays open on Escape when closeOnPressEscape is false', async () => {
    const { modalApi } = await mountModal({ closeOnPressEscape: false });

    pressEscape();
    await settle();

    expect(modalApi.store.state.isOpen).toBe(true);
  });

  it('closes when the dismissable overlay is pointer-downed', async () => {
    const { modalApi } = await mountModal();

    expect(pointerDownOverlay()).toBe(true);
    await expect.poll(() => modalApi.store.state.isOpen).toBe(false);
  });

  it('stays open on overlay pointer-down when closeOnClickModal is false', async () => {
    const { modalApi } = await mountModal({ closeOnClickModal: false });

    expect(pointerDownOverlay()).toBe(true);
    await settle();

    expect(modalApi.store.state.isOpen).toBe(true);
  });
});

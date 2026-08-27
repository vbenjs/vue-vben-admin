import type { App } from 'vue';

import { computed, createApp, defineComponent, h, nextTick, ref } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';

import Alert from '../alert.vue';

vi.mock('@vben-core/composables', () => ({
  useScrollLock: () =>
    computed({
      get: () => false,
      set: () => {},
    }),
  useSimpleLocale: () => ({
    $t: (key: string) => key,
  }),
}));

vi.mock('@vben-core/preferences', () => ({
  usePreferences: () => ({
    globalEscapeShortcutKey: { value: true },
  }),
}));

let activeApp: App | undefined;

/**
 * 挂载一个受控的 Alert 组件，用于验证鼠标点击与键盘交互后的关闭行为和事件副作用。
 */
async function mountAlert() {
  const state = ref(true);
  const onConfirm = vi.fn();
  const onUpdateOpen = vi.fn((value: boolean) => {
    state.value = value;
  });
  const Consumer = defineComponent(
    () => () =>
      h(Alert, {
        content: 'Alert content',
        title: 'Alert title',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        open: state.value,
        showCancel: true,
        onConfirm,
        'onUpdate:open': onUpdateOpen,
      }),
  );
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp(Consumer);
  activeApp.mount(host);
  await nextTick();
  await nextTick();

  return { onConfirm, onUpdateOpen, state };
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('vben alert', () => {
  it('closes and emits confirm once when the confirm button is clicked', async () => {
    const { onConfirm, onUpdateOpen, state } = await mountAlert();
    const button = [...document.querySelectorAll('button')].find(
      (element) => element.textContent?.trim() === 'Confirm',
    );

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onUpdateOpen).toHaveBeenCalledWith(false);
    expect(state.value).toBe(false);
  });

  it('closes without confirming when the cancel button is clicked', async () => {
    const { onConfirm, onUpdateOpen, state } = await mountAlert();
    const button = [...document.querySelectorAll('button')].find(
      (element) => element.textContent?.trim() === 'Cancel',
    );

    expect(button).toBeInstanceOf(HTMLElement);
    if (!(button instanceof HTMLElement)) return;
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onUpdateOpen).toHaveBeenCalledWith(false);
    expect(state.value).toBe(false);
  });

  it('closes when Escape is pressed', async () => {
    const { onConfirm, onUpdateOpen, state } = await mountAlert();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
    );
    await nextTick();

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onUpdateOpen).toHaveBeenCalledWith(false);
    expect(state.value).toBe(false);
  });
});

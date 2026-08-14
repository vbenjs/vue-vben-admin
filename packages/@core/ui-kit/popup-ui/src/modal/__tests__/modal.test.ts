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

async function mountModal(options: { onClosed?: () => void } = {}) {
  const mainContent = document.createElement('main');
  mainContent.id = ELEMENT_ID_MAIN_CONTENT;
  mainContent.innerHTML = '<div><div></div></div>';
  document.body.append(mainContent);

  let capturedApi: ReturnType<typeof useVbenModal>[1] | undefined;
  const Consumer = defineComponent(() => {
    const [Modal, modalApi] = useVbenModal({
      appendToMain: true,
      draggable: true,
      title: 'Draggable modal',
      ...(options.onClosed ? { onClosed: options.onClosed } : {}),
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

  if (!capturedApi) {
    throw new Error('modal api was not captured');
  }
  return { mainContent, modalApi: capturedApi };
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('vben modal', () => {
  it('mounts an open modal directly in the main content', async () => {
    const { mainContent } = await mountModal();
    const dialog = document.querySelector('[role="dialog"]');
    const overlay = document.querySelector('[data-dismissable-modal]');

    expect(dialog).toBeInstanceOf(HTMLElement);
    if (!(dialog instanceof HTMLElement)) return;
    expect(overlay).toBeInstanceOf(HTMLElement);
    if (!(overlay instanceof HTMLElement)) return;
    expect(dialog.parentElement).toBe(mainContent);
    expect(overlay.parentElement).toBe(mainContent);
  });

  it('constrains dragging to the main content', async () => {
    const { mainContent } = await mountModal();
    const dialog = document.querySelector('[role="dialog"]');
    const header = document.querySelector('.cursor-move');

    expect(dialog).toBeInstanceOf(HTMLElement);
    if (!(dialog instanceof HTMLElement)) return;
    expect(header).toBeInstanceOf(HTMLElement);
    if (!(header instanceof HTMLElement)) return;

    vi.spyOn(mainContent, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(100, 100, 800, 600),
    );
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(300, 200, 400, 300),
    );

    header.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        clientX: 400,
        clientY: 300,
      }),
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 1400,
        clientY: 1300,
      }),
    );

    expect(dialog.style.transform).toBe('translate(200px, 200px)');
    document.dispatchEvent(new MouseEvent('mouseup'));
  });

  it('fires onClosed via the fallback when no animation event arrives', async () => {
    vi.useFakeTimers({
      toFake: [
        'cancelAnimationFrame',
        'clearTimeout',
        'requestAnimationFrame',
        'setTimeout',
      ],
    });
    try {
      const onClosed = vi.fn();
      const { modalApi } = await mountModal({ onClosed });
      // happy-dom fires no animation events — without the fallback the
      // `closed` event (and with it `onClosed`) would never fire and the
      // close chain would hang. The fallback timer must acknowledge it.
      await modalApi.close();
      await vi.advanceTimersByTimeAsync(400);
      expect(onClosed).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('emits closed exactly once when the animation event and the fallback both fire', async () => {
    vi.useFakeTimers({
      toFake: [
        'cancelAnimationFrame',
        'clearTimeout',
        'requestAnimationFrame',
        'setTimeout',
      ],
    });
    try {
      const onClosed = vi.fn();
      const { modalApi } = await mountModal({ onClosed });
      await modalApi.close();
      // The exit animation ends normally — acknowledged immediately...
      const dialog = document.querySelector('[role="dialog"]');
      if (!(dialog instanceof HTMLElement)) {
        throw new Error('dialog content not found');
      }
      dialog.dispatchEvent(new Event('animationend'));
      // ...and the fallback must not emit a second `closed`.
      await vi.advanceTimersByTimeAsync(400);
      expect(onClosed).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

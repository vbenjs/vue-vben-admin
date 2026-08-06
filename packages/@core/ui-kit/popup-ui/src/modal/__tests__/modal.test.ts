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

async function mountModal() {
  const mainContent = document.createElement('main');
  mainContent.id = ELEMENT_ID_MAIN_CONTENT;
  mainContent.innerHTML = '<div><div></div></div>';
  document.body.append(mainContent);

  const Consumer = defineComponent(() => {
    const [Modal, modalApi] = useVbenModal({
      appendToMain: true,
      draggable: true,
      title: 'Draggable modal',
    });
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

  return mainContent;
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('vben modal', () => {
  it('mounts an open modal directly in the main content', async () => {
    const mainContent = await mountModal();
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
    const mainContent = await mountModal();
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
});

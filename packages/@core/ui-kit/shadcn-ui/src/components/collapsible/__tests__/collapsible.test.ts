import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { afterEach, describe, expect, it } from 'vitest';

import VbenCollapsible from '../collapsible.vue';

let activeApp: ReturnType<typeof createApp> | undefined;

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
});

describe('VbenCollapsible', () => {
  it('keeps a one-pixel paint buffer around animated content', async () => {
    const host = document.createElement('div');
    document.body.append(host);

    const open = ref(true);
    const Consumer = defineComponent(
      () => () =>
        h(
          VbenCollapsible,
          { open: open.value },
          {
            collapsibleContent: () => h('div', { class: 'content-probe' }),
          },
        ),
    );

    activeApp = createApp(Consumer);
    activeApp.mount(host);
    await nextTick();

    const content = host.querySelector('[class~="-mx-px"]');
    expect(content).toBeInstanceOf(HTMLElement);
    if (!(content instanceof HTMLElement)) return;

    expect(content.classList.contains('px-px')).toBe(true);
    expect(content.classList.contains('overflow-hidden')).toBe(true);

    open.value = false;
    await nextTick();
    expect(content.getAttribute('data-state')).toBe('closed');
  });
});

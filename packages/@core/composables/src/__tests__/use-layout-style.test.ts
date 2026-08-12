import type { App } from 'vue';

import { createApp, h } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useLayoutContentStyle } from '../use-layout-style';

let activeApp: App | undefined;

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('useLayoutContentStyle', () => {
  it('positions overlays without observing content size', () => {
    const resizeObserver = vi.fn();
    vi.stubGlobal('ResizeObserver', resizeObserver);

    const host = document.createElement('div');
    document.body.append(host);

    activeApp = createApp({
      setup() {
        const { contentElement, overlayStyle } = useLayoutContentStyle();
        return () =>
          h('main', { ref: contentElement }, [
            h('div', { style: overlayStyle.value }),
          ]);
      },
    });
    activeApp.mount(host);

    const overlay = host.querySelector<HTMLElement>('main > div');
    expect(overlay).toBeDefined();
    if (!overlay) return;

    expect(resizeObserver).not.toHaveBeenCalled();
    expect(overlay.style.position).toBe('absolute');
    expect(`${overlay.style.inset}`).toBe('0');
  });
});

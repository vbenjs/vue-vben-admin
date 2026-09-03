import type { App } from 'vue';

import { createApp } from 'vue';

import { CSS_VARIABLE_LAYOUT_VIEWPORT_HEIGHT } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useLayoutViewportHeight } from '../use-layout-viewport-height';

let activeApp: App | undefined;

function stubDvhSupport(supported: boolean) {
  vi.stubGlobal('CSS', {
    supports: vi.fn((property: string, value: string) => {
      return supported && property === 'height' && value === '1dvh';
    }),
  });
}

function mountViewportHeight() {
  const host = document.createElement('div');
  document.body.append(host);

  activeApp = createApp({
    setup() {
      useLayoutViewportHeight();
      return () => null;
    },
  });
  activeApp.mount(host);
}

function getViewportHeightVar() {
  return document.documentElement.style.getPropertyValue(
    CSS_VARIABLE_LAYOUT_VIEWPORT_HEIGHT,
  );
}

async function flushAnimationFrame() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  document.documentElement.style.removeProperty(
    CSS_VARIABLE_LAYOUT_VIEWPORT_HEIGHT,
  );
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useLayoutViewportHeight', () => {
  it('does not write the CSS variable when dvh is supported', () => {
    const resizeObserver = vi.fn();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    vi.stubGlobal('ResizeObserver', resizeObserver);
    stubDvhSupport(true);

    mountViewportHeight();

    expect(getViewportHeightVar()).toBe('');
    expect(resizeObserver).not.toHaveBeenCalled();
    expect(addEventListener).not.toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });

  it('writes innerHeight when dvh is unsupported', () => {
    const resizeObserver = vi.fn();
    vi.stubGlobal('ResizeObserver', resizeObserver);
    stubDvhSupport(false);
    vi.stubGlobal('visualViewport', null);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);

    mountViewportHeight();

    expect(getViewportHeightVar()).toBe('800px');
    expect(resizeObserver).not.toHaveBeenCalled();
  });

  it('prefers visualViewport.height over innerHeight', () => {
    stubDvhSupport(false);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
    const visualViewport = new EventTarget() as VisualViewport;
    Object.defineProperty(visualViewport, 'height', {
      configurable: true,
      value: 640,
      writable: true,
    });
    vi.stubGlobal('visualViewport', visualViewport);

    mountViewportHeight();

    expect(getViewportHeightVar()).toBe('640px');
  });

  it('updates the CSS variable on visualViewport resize and stops after unmount', async () => {
    stubDvhSupport(false);
    const visualViewport = new EventTarget() as VisualViewport;
    Object.defineProperty(visualViewport, 'height', {
      configurable: true,
      value: 640,
      writable: true,
    });
    vi.stubGlobal('visualViewport', visualViewport);

    mountViewportHeight();
    expect(getViewportHeightVar()).toBe('640px');

    Object.defineProperty(visualViewport, 'height', {
      configurable: true,
      value: 520,
      writable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));
    await flushAnimationFrame();

    expect(getViewportHeightVar()).toBe('520px');

    activeApp?.unmount();
    activeApp = undefined;

    Object.defineProperty(visualViewport, 'height', {
      configurable: true,
      value: 400,
      writable: true,
    });
    visualViewport.dispatchEvent(new Event('resize'));
    await flushAnimationFrame();

    expect(getViewportHeightVar()).toBe('520px');
  });
});

import type { App, WritableComputedRef } from 'vue';

import { createApp, nextTick } from 'vue';

import { ELEMENT_ID_LAYOUT_SCROLL } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCROLL_FIXED_CLASS, useScrollLock } from '../use-scroll-lock';

let activeApp: App | undefined;

function createScrollableElement(id?: string) {
  const element = document.createElement('div');
  if (id) {
    element.id = id;
  }
  element.style.overflow = 'auto';
  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: 100 },
    scrollHeight: { configurable: true, value: 120 },
  });
  document.body.append(element);
  return element;
}

function mountScrollLock(options?: { immediate?: boolean }) {
  let scrollLock: undefined | WritableComputedRef<boolean>;
  const host = document.createElement('div');
  document.body.append(host);

  activeApp = createApp({
    setup() {
      scrollLock = useScrollLock(options);
      return () => null;
    },
  });
  activeApp.mount(host);

  if (!scrollLock) {
    throw new Error('useScrollLock was not initialized');
  }
  return scrollLock;
}

async function flushMountedLock() {
  await nextTick();
  await nextTick();
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  document.body.style.cssText = '';
  vi.restoreAllMocks();
});

describe('useScrollLock', () => {
  it('should lock the layout scroll element first', async () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    element.style.setProperty('scrollbar-gutter', 'auto');
    const scrollLock = mountScrollLock();

    await flushMountedLock();

    expect(scrollLock.value).toBe(true);
    expect(element.style.overflow).toBe('hidden');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('stable');
    expect(document.body.style.overflow).not.toBe('hidden');

    activeApp?.unmount();
    activeApp = undefined;

    expect(element.style.overflow).toBe('auto');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('auto');
  });

  it('should support manual locking', async () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    const scrollLock = mountScrollLock({ immediate: false });

    await flushMountedLock();
    expect(scrollLock.value).toBe(false);

    scrollLock.value = true;
    expect(element.style.overflow).toBe('hidden');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('stable');

    scrollLock.value = false;
    expect(element.style.overflow).toBe('auto');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('');
  });

  it('should fall back to body and compensate fixed nodes', async () => {
    document.body.style.overflow = 'auto';
    Object.defineProperties(document.body, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 120 },
    });
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
      120,
    );
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(100);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      overflowY: 'auto',
    } as CSSStyleDeclaration);

    const fixedNode = document.createElement('div');
    fixedNode.className = SCROLL_FIXED_CLASS;
    fixedNode.style.transition = 'opacity 200ms';
    document.body.append(fixedNode);
    const scrollLock = mountScrollLock();

    await flushMountedLock();

    expect(scrollLock.value).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('0px');
    expect(fixedNode.style.paddingRight).toBe('0px');

    activeApp?.unmount();
    activeApp = undefined;

    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.paddingRight).toBe('');
    expect(fixedNode.style.paddingRight).toBe('');
  });
});

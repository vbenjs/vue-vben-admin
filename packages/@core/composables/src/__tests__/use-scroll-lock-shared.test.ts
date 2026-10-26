/* eslint-disable vue/one-component-per-file -- Test fixtures cover parent/child mount ordering. */

import type { App, WritableComputedRef } from 'vue';

import {
  createApp,
  defineComponent,
  h,
  nextTick,
  onMounted,
  shallowRef,
} from 'vue';

import { ELEMENT_ID_LAYOUT_SCROLL } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCROLL_FIXED_CLASS, useScrollLock } from '../use-scroll-lock';

let activeApp: App | undefined;
const apps = new Set<App>();

function getActiveApp() {
  if (!activeApp) {
    throw new Error('No mounted app');
  }
  return activeApp;
}

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
  apps.add(activeApp);

  if (!scrollLock) {
    throw new Error('useScrollLock was not initialized');
  }
  return scrollLock;
}

afterEach(() => {
  apps.forEach((app) => app.unmount());
  apps.clear();
  activeApp = undefined;
  vi.useRealTimers();
  document.body.innerHTML = '';
  document.body.style.cssText = '';
  vi.restoreAllMocks();
});

describe('useScrollLock', () => {
  it('waits for parent mounted updates before checking for a scrollbar', async () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      get: () => (element.textContent?.includes('expanded') ? 120 : 100),
    });
    const overlay = defineComponent({
      setup() {
        useScrollLock();
        return () => null;
      },
    });
    const app = createApp({
      setup() {
        const expanded = shallowRef(false);
        onMounted(() => {
          expanded.value = true;
        });
        return () => [h(overlay), h('div', expanded.value ? 'expanded' : '')];
      },
    });
    apps.add(app);
    app.mount(element);
    await nextTick();
    await nextTick();
    expect(element.style.overflow).toBe('hidden');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('stable');
  });

  it('restores body and fixed styles only after the last owner releases', async () => {
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame'],
    });
    document.body.style.overflow = 'auto';
    document.body.style.setProperty('padding-right', '6px', 'important');
    Object.defineProperties(document.body, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 120 },
    });
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
      120,
    );
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(100);
    const fixed = document.createElement('header');
    fixed.className = SCROLL_FIXED_CLASS;
    fixed.style.setProperty('padding-right', '4px', 'important');
    fixed.style.setProperty('transition', 'color 1s', 'important');
    document.body.append(fixed);
    const first = mountScrollLock();
    await nextTick();
    const second = mountScrollLock();
    await nextTick();
    first.value = false;
    expect(document.body.style.overflow).toBe('hidden');
    expect(fixed.style.transition).toBe('none');
    expect(vi.getTimerCount()).toBe(0);
    second.value = false;
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.paddingRight).toBe('6px');
    expect(document.body.style.getPropertyPriority('padding-right')).toBe(
      'important',
    );
    expect(fixed.style.paddingRight).toBe('4px');
    expect(fixed.style.getPropertyPriority('padding-right')).toBe('important');

    expect(fixed.style.transition).toBe('none');
    vi.advanceTimersToNextFrame();
    expect(fixed.style.transition).toBe('color 1s');
    expect(fixed.style.getPropertyPriority('transition')).toBe('important');
  });

  it.each(['', 'important'])(
    'preserves transition across lock cycles before the next frame (priority: %s)',
    async (priority) => {
      vi.useFakeTimers({
        toFake: ['requestAnimationFrame', 'cancelAnimationFrame'],
      });
      document.body.style.overflow = 'auto';
      Object.defineProperties(document.body, {
        clientHeight: { configurable: true, value: 100 },
        scrollHeight: { configurable: true, value: 120 },
      });
      vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
        120,
      );
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(100);
      const fixed = document.createElement('header');
      fixed.className = SCROLL_FIXED_CLASS;
      fixed.style.setProperty('transition', 'color 1s', priority);
      const unstyled = document.createElement('footer');
      unstyled.className = SCROLL_FIXED_CLASS;
      document.body.append(fixed, unstyled);

      const first = mountScrollLock();
      await nextTick();
      first.value = false;
      const second = mountScrollLock();
      await nextTick();
      vi.advanceTimersToNextFrame();
      expect(fixed.style.transition).toBe('none');
      expect(unstyled.style.transition).toBe('none');

      second.value = false;
      vi.advanceTimersToNextFrame();
      expect(fixed.style.transition).toBe('color 1s');
      expect(fixed.style.getPropertyPriority('transition')).toBe(priority);
      expect(unstyled.style.transition).toBe('');
    },
  );

  it('selects the current container for each new lock cycle', async () => {
    const firstTarget = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    firstTarget.style.setProperty('scrollbar-gutter', 'auto', 'important');
    const first = mountScrollLock();
    await nextTick();
    first.value = false;
    firstTarget.removeAttribute('id');
    const secondTarget = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    const second = mountScrollLock();
    await nextTick();
    expect(firstTarget.style.overflow).toBe('auto');
    expect(firstTarget.style.getPropertyValue('scrollbar-gutter')).toBe('auto');
    expect(firstTarget.style.getPropertyPriority('scrollbar-gutter')).toBe(
      'important',
    );
    expect(secondTarget.style.overflow).toBe('hidden');
    second.value = false;
    expect(secondTarget.style.overflow).toBe('auto');
  });

  it('does not lock a non-scrollable target automatically but permits manual locking', async () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 100,
    });
    const lock = mountScrollLock();
    await nextTick();
    expect(lock.value).toBe(false);
    lock.value = true;
    expect(element.style.overflow).toBe('hidden');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('');
    lock.value = false;
    expect(element.style.overflow).toBe('auto');
  });

  it.each(['first', 'last'])(
    'keeps overlapping locks when the %s owner unmounts',
    async (order) => {
      const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
      mountScrollLock();
      const firstApp = getActiveApp();
      await nextTick();
      const secondLock = mountScrollLock();
      const secondApp = getActiveApp();
      await nextTick();

      expect(secondLock.value).toBe(true);
      const closingApp = order === 'first' ? firstApp : secondApp;
      const remainingApp = order === 'first' ? secondApp : firstApp;
      closingApp.unmount();
      apps.delete(closingApp);
      expect(element.style.overflow).toBe('hidden');
      expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('stable');
      remainingApp.unmount();
      apps.delete(remainingApp);
      expect(element.style.overflow).toBe('auto');
      expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('');
    },
  );

  it('balances repeated manual locking without releasing another owner', () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    const first = mountScrollLock({ immediate: false });
    const second = mountScrollLock({ immediate: false });
    first.value = true;
    second.value = true;
    second.value = true;
    first.value = false;
    first.value = false;
    expect(element.style.overflow).toBe('hidden');
    expect(first.value).toBe(false);
    expect(second.value).toBe(true);
    second.value = false;
    expect(element.style.overflow).toBe('auto');
  });

  it('does not release another owner when an unlocked caller unmounts', async () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    const first = mountScrollLock();
    await nextTick();
    const second = mountScrollLock({ immediate: false });
    const secondApp = getActiveApp();
    expect(second.value).toBe(false);
    secondApp.unmount();
    apps.delete(secondApp);
    expect(element.style.overflow).toBe('hidden');
    first.value = false;
    expect(element.style.overflow).toBe('auto');
  });

  it('does not acquire a lock after unmounting before nextTick', async () => {
    const element = createScrollableElement(ELEMENT_ID_LAYOUT_SCROLL);
    const lock = mountScrollLock();
    getActiveApp().unmount();
    apps.delete(getActiveApp());
    await nextTick();
    expect(lock.value).toBe(false);
    expect(element.style.overflow).toBe('auto');
    expect(element.style.getPropertyValue('scrollbar-gutter')).toBe('');
  });
});

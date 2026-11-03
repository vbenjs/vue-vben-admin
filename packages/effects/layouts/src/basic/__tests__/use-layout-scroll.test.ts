import type { App } from 'vue';
import type { NavigationGuard, NavigationHookAfter, Router } from 'vue-router';

import { createApp } from 'vue';

import { ELEMENT_ID_LAYOUT_SCROLL } from '@vben-core/shared/constants';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useLayoutScroll } from '../use-layout-scroll';

let activeApp: App | undefined;

function createRouterMock() {
  let afterHook: NavigationHookAfter | undefined;
  let beforeGuard: NavigationGuard | undefined;
  const removeAfterHook = vi.fn();
  const removeBeforeGuard = vi.fn();

  const router = {
    afterEach: vi.fn((hook: NavigationHookAfter) => {
      afterHook = hook;
      return removeAfterHook;
    }),
    beforeEach: vi.fn((guard: NavigationGuard) => {
      beforeGuard = guard;
      return removeBeforeGuard;
    }),
  } as unknown as Router;

  function getHooks() {
    if (!afterHook || !beforeGuard) {
      throw new Error('Router hooks were not registered');
    }
    return { afterHook, beforeGuard };
  }

  return {
    getHooks,
    removeAfterHook,
    removeBeforeGuard,
    router,
  };
}

function createScrollElement() {
  const element = document.createElement('div');
  element.id = ELEMENT_ID_LAYOUT_SCROLL;
  // 持有 mock 本体做断言，避免经 DOM 类型读方法引用（unbound-method 误报）。
  const scrollTo = vi.fn();
  element.scrollTo = scrollTo;
  document.body.append(element);
  return { element, scrollTo };
}

function mountLayoutScroll(router: Router) {
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp({
    setup() {
      useLayoutScroll(router);
      return () => null;
    },
  });
  activeApp.mount(host);
}

async function runBeforeGuard(guard: NavigationGuard) {
  await guard({} as never, {} as never, vi.fn());
}

async function runAfterHook(hook: NavigationHookAfter, hash = '') {
  await hook({ hash } as never, {} as never, undefined);
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  window.history.replaceState({}, '');
  vi.restoreAllMocks();
});

describe('useLayoutScroll', () => {
  it('should scroll to top after a normal navigation', async () => {
    window.history.replaceState({ position: 0 }, '');
    const { element, scrollTo } = createScrollElement();
    element.scrollTop = 240;
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook, beforeGuard } = routerMock.getHooks();

    await runBeforeGuard(beforeGuard);
    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('should scroll a hash target into view', async () => {
    window.history.replaceState({ position: 0 }, '');
    const { element, scrollTo } = createScrollElement();
    const hashTarget = document.createElement('div');
    hashTarget.id = 'section';
    const scrollIntoView = vi.fn();
    hashTarget.scrollIntoView = scrollIntoView;
    element.append(hashTarget);
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook } = routerMock.getHooks();

    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook, '#section');

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('should ignore matching hash targets outside the layout', async () => {
    window.history.replaceState({ position: 0 }, '');
    const hostTarget = document.createElement('div');
    hostTarget.id = 'section';
    const hostScrollIntoView = vi.fn();
    hostTarget.scrollIntoView = hostScrollIntoView;
    document.body.append(hostTarget);
    const { element } = createScrollElement();
    const layoutTarget = document.createElement('div');
    layoutTarget.id = 'section';
    const layoutScrollIntoView = vi.fn();
    layoutTarget.scrollIntoView = layoutScrollIntoView;
    element.append(layoutTarget);
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook } = routerMock.getHooks();

    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook, '#section');

    expect(layoutScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(hostScrollIntoView).not.toHaveBeenCalled();
  });

  it('should restore a saved position on history navigation', async () => {
    window.history.replaceState({ position: 0 }, '');
    const { element, scrollTo } = createScrollElement();
    element.scrollTop = 240;
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook, beforeGuard } = routerMock.getHooks();

    await runBeforeGuard(beforeGuard);
    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook);

    element.scrollTop = 80;
    window.history.replaceState({ position: 0 }, '');
    await runBeforeGuard(beforeGuard);
    await runAfterHook(afterHook);

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 240 });
  });

  it('should remove router hooks when the scope is disposed', () => {
    window.history.replaceState({ position: 0 }, '');
    createScrollElement();
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);

    activeApp?.unmount();
    activeApp = undefined;

    expect(routerMock.removeBeforeGuard).toHaveBeenCalledOnce();
    expect(routerMock.removeAfterHook).toHaveBeenCalledOnce();
  });
});

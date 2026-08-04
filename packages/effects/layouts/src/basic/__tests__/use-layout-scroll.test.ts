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
  element.scrollTo = vi.fn();
  document.body.append(element);
  return element;
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
    const element = createScrollElement();
    element.scrollTop = 240;
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook, beforeGuard } = routerMock.getHooks();

    await runBeforeGuard(beforeGuard);
    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook);

    expect(element.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('should scroll a hash target into view', async () => {
    window.history.replaceState({ position: 0 }, '');
    const element = createScrollElement();
    const hashTarget = document.createElement('div');
    hashTarget.id = 'section';
    hashTarget.scrollIntoView = vi.fn();
    element.append(hashTarget);
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook } = routerMock.getHooks();

    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook, '#section');

    expect(hashTarget.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(element.scrollTo).not.toHaveBeenCalled();
  });

  it('should ignore matching hash targets outside the layout', async () => {
    window.history.replaceState({ position: 0 }, '');
    const hostTarget = document.createElement('div');
    hostTarget.id = 'section';
    hostTarget.scrollIntoView = vi.fn();
    document.body.append(hostTarget);
    const element = createScrollElement();
    const layoutTarget = document.createElement('div');
    layoutTarget.id = 'section';
    layoutTarget.scrollIntoView = vi.fn();
    element.append(layoutTarget);
    const routerMock = createRouterMock();
    mountLayoutScroll(routerMock.router);
    const { afterHook } = routerMock.getHooks();

    window.history.replaceState({ position: 1 }, '');
    await runAfterHook(afterHook, '#section');

    expect(layoutTarget.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(hostTarget.scrollIntoView).not.toHaveBeenCalled();
  });

  it('should restore a saved position on history navigation', async () => {
    window.history.replaceState({ position: 0 }, '');
    const element = createScrollElement();
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

    expect(element.scrollTo).toHaveBeenLastCalledWith({ top: 240 });
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

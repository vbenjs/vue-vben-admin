import type { App } from 'vue';
import type { NavigationGuard, NavigationHookAfter, Router } from 'vue-router';

import { createApp, nextTick } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import { useContentSpinner } from '../use-content-spinner';

// preferences 是模块级单例，测试里用可变 mock 控制开关
const mockPreferences = vi.hoisted(() => ({ transition: { loading: true } }));

vi.mock('@vben/preferences', () => ({
  preferences: mockPreferences,
}));

// useRouter 从实例注入取 router，测试里用 holder 直接供给
const routerHolder = vi.hoisted(() => ({
  current: undefined as undefined | { afterEach: unknown; beforeEach: unknown },
}));

vi.mock('vue-router', () => ({
  useRouter: () => routerHolder.current,
}));

const SHOW_DELAY = 200;
const MIN_SHOW_TIME = 500;

function createRouterMock() {
  let afterHook: NavigationHookAfter | undefined;
  let beforeGuard: NavigationGuard | undefined;
  const router = {
    afterEach: vi.fn((hook: NavigationHookAfter) => {
      afterHook = hook;
    }),
    beforeEach: vi.fn((guard: NavigationGuard) => {
      beforeGuard = guard;
    }),
  } as unknown as Router;

  function getHooks() {
    if (!afterHook || !beforeGuard) {
      throw new Error('Router hooks were not registered');
    }
    return { afterHook, beforeGuard };
  }

  return { getHooks, router };
}

let activeApp: App | undefined;

/** 挂载组合式函数并返回对 spinning 的实时读取 */
function mountSpinner(router: Router) {
  routerHolder.current = router as never;
  const host = document.createElement('div');
  document.body.append(host);
  let spinningRef: undefined | { value: boolean };
  activeApp = createApp({
    setup() {
      const { spinning } = useContentSpinner(router);
      spinningRef = spinning;
      return () => null;
    },
  });
  activeApp.mount(host);
  return () => spinningRef?.value ?? false;
}

function makeRoute(meta: Record<string, unknown> = {}) {
  return { meta } as never;
}

function runBefore(guard: NavigationGuard, meta: Record<string, unknown> = {}) {
  return guard(makeRoute(meta), makeRoute(), vi.fn());
}

function runAfter(
  hook: NavigationHookAfter,
  meta: Record<string, unknown> = {},
) {
  return hook(makeRoute(meta), makeRoute(), undefined);
}

function cleanup() {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  routerHolder.current = undefined;
}

describe('useContentSpinner', () => {
  it('does not show spinner when navigation finishes within showDelay', async () => {
    vi.useFakeTimers();
    try {
      const routerMock = createRouterMock();
      const isSpinning = mountSpinner(routerMock.router);
      const timerBaseline = vi.getTimerCount();
      const { afterHook, beforeGuard } = routerMock.getHooks();

      await runBefore(beforeGuard);
      // 在 showDelay 之前完成导航
      vi.advanceTimersByTime(SHOW_DELAY - 50);
      await runAfter(afterHook);
      vi.advanceTimersByTime(SHOW_DELAY * 2);
      await nextTick();

      expect(isSpinning()).toBe(false);
      // 快速导航不应遗留任何净新增定时器（环境基线之上）
      expect(vi.getTimerCount()).toBe(timerBaseline);
    } finally {
      vi.useRealTimers();
      cleanup();
    }
  });

  it('shows spinner after showDelay and hides it after navigation ends', async () => {
    vi.useFakeTimers();
    try {
      const routerMock = createRouterMock();
      const isSpinning = mountSpinner(routerMock.router);
      const { afterHook, beforeGuard } = routerMock.getHooks();

      await runBefore(beforeGuard);
      vi.advanceTimersByTime(SHOW_DELAY);
      await nextTick();
      expect(isSpinning()).toBe(true);

      // 导航耗时 800ms > minShowTime，afterEach 时立即隐藏
      vi.advanceTimersByTime(800 - SHOW_DELAY);
      await runAfter(afterHook);
      await nextTick();
      expect(isSpinning()).toBe(false);
    } finally {
      vi.useRealTimers();
      cleanup();
    }
  });

  it('keeps spinner for minShowTime when navigation is slightly slow', async () => {
    vi.useFakeTimers();
    try {
      const routerMock = createRouterMock();
      const isSpinning = mountSpinner(routerMock.router);
      const { afterHook, beforeGuard } = routerMock.getHooks();

      await runBefore(beforeGuard);
      vi.advanceTimersByTime(SHOW_DELAY);
      await nextTick();
      expect(isSpinning()).toBe(true);

      // 导航耗时 300ms < minShowTime：spinner 应保留到 500ms
      vi.advanceTimersByTime(300 - SHOW_DELAY);
      await runAfter(afterHook);
      await nextTick();
      expect(isSpinning()).toBe(true);

      vi.advanceTimersByTime(MIN_SHOW_TIME - 300);
      await nextTick();
      expect(isSpinning()).toBe(false);
    } finally {
      vi.useRealTimers();
      cleanup();
    }
  });

  it('never shows spinner for rapid consecutive navigations', async () => {
    vi.useFakeTimers();
    try {
      const routerMock = createRouterMock();
      const isSpinning = mountSpinner(routerMock.router);
      const { afterHook, beforeGuard } = routerMock.getHooks();

      // 连续三次快速导航，任意时刻都不应显示
      await runBefore(beforeGuard);
      vi.advanceTimersByTime(100);
      await runAfter(afterHook);
      await runBefore(beforeGuard);
      vi.advanceTimersByTime(150);
      await runAfter(afterHook);
      await runBefore(beforeGuard);
      vi.advanceTimersByTime(180);
      await runAfter(afterHook);
      vi.advanceTimersByTime(1000);
      await nextTick();

      expect(isSpinning()).toBe(false);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
      cleanup();
    }
  });

  it('skips spinner entirely for routes marked as loaded', async () => {
    vi.useFakeTimers();
    try {
      const routerMock = createRouterMock();
      const isSpinning = mountSpinner(routerMock.router);
      const { afterHook, beforeGuard } = routerMock.getHooks();

      await runBefore(beforeGuard, { loaded: true });
      vi.advanceTimersByTime(SHOW_DELAY * 2);
      await runAfter(afterHook, { loaded: true });
      await nextTick();

      expect(isSpinning()).toBe(false);
    } finally {
      vi.useRealTimers();
      cleanup();
    }
  });

  it('skips spinner when transition loading is disabled', async () => {
    vi.useFakeTimers();
    try {
      mockPreferences.transition.loading = false;
      const routerMock = createRouterMock();
      const isSpinning = mountSpinner(routerMock.router);
      const { afterHook, beforeGuard } = routerMock.getHooks();

      await runBefore(beforeGuard);
      vi.advanceTimersByTime(SHOW_DELAY * 2);
      await runAfter(afterHook);
      await nextTick();

      expect(isSpinning()).toBe(false);
    } finally {
      mockPreferences.transition.loading = true;
      vi.useRealTimers();
      cleanup();
    }
  });
});

import type { Page } from '@playwright/test';

type PreferenceUpdates = Parameters<
  NonNullable<Window['__VBEN_LAYOUT_TEST__']>['updatePreferences']
>[0];

const LAYOUT_TYPES = [
  'sidebar-nav',
  'header-nav',
  'mixed-nav',
  'sidebar-mixed-nav',
  'header-mixed-nav',
  'header-sidebar-nav',
  'full-content',
] as const;

interface RegionMetrics {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  visible: boolean;
  width: number;
}

interface LayoutMetrics {
  body: {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollWidth: number;
  };
  document: {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollWidth: number;
  };
  regions: Record<string, null | RegionMetrics>;
  scroll: null | {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollWidth: number;
  };
}

async function waitForLayoutSettled(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  await page.waitForFunction(
    () => {
      const layout = document.querySelector('[data-layout-region="layout"]');
      if (!layout) return false;

      return document.getAnimations().every((animation) => {
        const effect = animation.effect as KeyframeEffect | null;
        const target = effect?.target;
        if (!(target instanceof Element) || !layout.contains(target)) {
          return true;
        }
        if (!Number.isFinite(effect.getComputedTiming().endTime)) {
          return true;
        }
        return animation.playState !== 'running';
      });
    },
    undefined,
    { timeout: 2000 },
  );
}

async function updateLayoutPreferences(page: Page, updates: PreferenceUpdates) {
  await page.evaluate((preferenceUpdates) => {
    const api = window.__VBEN_LAYOUT_TEST__;
    if (!api) {
      throw new Error('Layout test API is not installed');
    }
    api.updatePreferences(preferenceUpdates);
  }, updates);
  await waitForLayoutSettled(page);
}

async function getLayoutMetrics(page: Page): Promise<LayoutMetrics> {
  return page.evaluate(() => {
    const selectors = {
      header: '[data-layout-region="header"]',
      layout: '[data-layout-region="layout"]',
      main: '[data-layout-region="main"]',
      pageContent: '[data-layout-region="page-content"]',
      sidebar: '[data-layout-region="sidebar"]',
      sidebarMask: '[data-layout-region="sidebar-mask"]',
    };

    function getRegionMetrics(selector: string): null | RegionMetrics {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) return null;

      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const visualWidth =
        selector === selectors.sidebar
          ? Math.max(
              ...[...element.children].map(
                (child) => child.getBoundingClientRect().right,
              ),
              rect.left,
            ) - rect.left
          : rect.width;
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.left + visualWidth,
        top: rect.top,
        visible:
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          Number.parseFloat(style.opacity || '1') > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.left < innerWidth &&
          rect.top < innerHeight,
        width: visualWidth,
      };
    }

    const layoutScroll = document.querySelector('#__vben_layout_scroll');
    return {
      body: {
        clientHeight: document.body.clientHeight,
        clientWidth: document.body.clientWidth,
        scrollHeight: document.body.scrollHeight,
        scrollWidth: document.body.scrollWidth,
      },
      document: {
        clientHeight: document.documentElement.clientHeight,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
      },
      regions: Object.fromEntries(
        Object.entries(selectors).map(([name, selector]) => [
          name,
          getRegionMetrics(selector),
        ]),
      ),
      scroll:
        layoutScroll instanceof HTMLElement
          ? {
              clientHeight: layoutScroll.clientHeight,
              clientWidth: layoutScroll.clientWidth,
              scrollHeight: layoutScroll.scrollHeight,
              scrollWidth: layoutScroll.scrollWidth,
            }
          : null,
    };
  });
}

export {
  getLayoutMetrics,
  LAYOUT_TYPES,
  updateLayoutPreferences,
  waitForLayoutSettled,
};
export type { LayoutMetrics, RegionMetrics };

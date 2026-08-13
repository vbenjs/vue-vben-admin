import type { Page } from '@playwright/test';

import type { LayoutMetrics, RegionMetrics } from './common/layout';

import { writeFile } from 'node:fs/promises';

import {
  getLayoutMetrics,
  LAYOUT_TYPES,
  updateLayoutPreferences,
  waitForLayoutSettled,
} from './common/layout';
import { measureSidebarPerformance } from './common/layout-performance';
import { expect, test } from './fixtures/layout';

const HEADER_MODES = ['fixed', 'static', 'auto', 'auto-scroll'] as const;

test.describe.configure({ mode: 'serial' });

function requireRegion(
  metrics: LayoutMetrics,
  name: keyof LayoutMetrics['regions'],
): RegionMetrics {
  const region = metrics.regions[name];
  if (!region) {
    throw new Error(`Missing layout region: ${String(name)}`);
  }
  return region;
}

function expectNoViewportOverflow(metrics: LayoutMetrics) {
  expect(metrics.body.scrollWidth).toBeLessThanOrEqual(
    metrics.body.clientWidth + 1,
  );
  expect(metrics.document.scrollWidth).toBeLessThanOrEqual(
    metrics.document.clientWidth + 1,
  );
  expect(metrics.body.scrollHeight).toBeLessThanOrEqual(
    metrics.body.clientHeight + 1,
  );
  expect(metrics.document.scrollHeight).toBeLessThanOrEqual(
    metrics.document.clientHeight + 1,
  );
}

async function configureDesktopRolePage(page: Page) {
  await page.setViewportSize({ height: 900, width: 1440 });
  await updateLayoutPreferences(page, {
    app: { layout: 'sidebar-nav' },
    footer: { enable: false },
    header: { enable: true, hidden: false, mode: 'fixed' },
    sidebar: {
      collapsed: false,
      enable: true,
      expandOnHover: true,
      hidden: false,
    },
    tabbar: { enable: true },
    widget: { sidebarToggle: true },
  });
}

async function getSidebarTransitionDuration(
  page: Page,
  property: 'clip-path' | 'transform',
) {
  return page
    .locator('[data-layout-region="sidebar"]')
    .evaluate((element, animatedProperty) => {
      const style = getComputedStyle(element);
      const properties = style.transitionProperty
        .split(',')
        .map((item) => item.trim());
      const durations = style.transitionDuration
        .split(',')
        .map(
          (item) =>
            Number.parseFloat(item) * (item.trim().endsWith('ms') ? 1 : 1000),
        );
      const index = properties.indexOf(animatedProperty);
      return index === -1 ? 0 : (durations[index] ?? durations[0] ?? 0);
    }, property);
}

test('keeps page content interactive while loading is hidden', async ({
  layoutPage,
}) => {
  await configureDesktopRolePage(layoutPage);
  const createButton = layoutPage.getByRole('button', {
    name: '新增角色',
  });
  await expect(createButton).toBeVisible();

  const hitRegion = await createButton.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return document
      .elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      ?.closest('[data-layout-region]')?.dataset.layoutRegion;
  });
  expect(hitRegion).not.toBe('content-overlay');

  await createButton.click();
  const dialog = layoutPage.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('button:has(.lucide-x)').click();
  await expect(dialog).toBeHidden();
});

test('keeps the layout background continuous while content scrolls', async ({
  layoutPage,
}) => {
  await configureDesktopRolePage(layoutPage);
  const result = await layoutPage.evaluate(() => {
    const scroll = document.querySelector('#__vben_layout_scroll');
    const main = document.querySelector('#__vben_main_content');
    if (!(scroll instanceof HTMLElement) || !(main instanceof HTMLElement)) {
      throw new Error('Layout scroll regions are missing');
    }

    const spacer = document.createElement('div');
    spacer.dataset.layoutTestSpacer = 'background';
    spacer.style.flex = '0 0 1600px';
    scroll.append(spacer);
    scroll.scrollTo({ top: scroll.scrollHeight });

    const mainRect = main.getBoundingClientRect();
    const scrollStyle = getComputedStyle(scroll);
    const mainStyle = getComputedStyle(main);
    const scrollBottom = scroll.scrollHeight - scroll.clientHeight;
    const mainBottomAtScrollEnd = mainRect.bottom - scrollBottom;
    spacer.remove();
    scroll.scrollTo({ top: 0 });

    return {
      mainBackground: mainStyle.backgroundColor,
      mainBottom: mainRect.bottom,
      mainBottomAtScrollEnd,
      scrollBackground: scrollStyle.backgroundColor,
      scrollBottom,
    };
  });

  expect(result.scrollBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(result.mainBackground).toBe('rgba(0, 0, 0, 0)');
  expect(result.mainBottomAtScrollEnd).toBeLessThanOrEqual(1);
  expect(result.scrollBottom).toBeGreaterThan(0);
});

test('uses the same deliberate duration for both sidebar controls', async ({
  layoutPage,
}) => {
  await configureDesktopRolePage(layoutPage);
  const bottomToggle = layoutPage.locator(
    '[data-layout-action="toggle-sidebar-collapse"]',
  );
  const headerToggle = layoutPage.locator(
    '[data-layout-action="toggle-sidebar"]',
  );
  expect(await getSidebarTransitionDuration(layoutPage, 'clip-path')).toBe(300);
  expect(await getSidebarTransitionDuration(layoutPage, 'transform')).toBe(300);

  await bottomToggle.click();
  await expect(
    layoutPage.locator('[data-layout-region="layout"]'),
  ).toHaveAttribute('data-sidebar-collapsed', 'true');
  await waitForLayoutSettled(layoutPage);
  await bottomToggle.click();
  await waitForLayoutSettled(layoutPage);

  await headerToggle.click();
  await expect
    .poll(() =>
      layoutPage
        .locator('[data-layout-region="sidebar"]')
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe('none');
  await waitForLayoutSettled(layoutPage);
  await headerToggle.click();
  await waitForLayoutSettled(layoutPage);
});

test('reuses one page across the desktop layout matrix', async ({
  layoutPage,
}) => {
  await configureDesktopRolePage(layoutPage);
  expect(layoutPage.context().pages()).toHaveLength(1);

  for (const layout of LAYOUT_TYPES) {
    await test.step(layout, async () => {
      await updateLayoutPreferences(layoutPage, { app: { layout } });
      const metrics = await getLayoutMetrics(layoutPage);
      const main = requireRegion(metrics, 'main');
      const pageContent = requireRegion(metrics, 'pageContent');
      const headerVisible = Boolean(metrics.regions.header?.visible);
      const sidebarVisible = Boolean(metrics.regions.sidebar?.visible);
      const expectsSidebar = !['full-content', 'header-nav'].includes(layout);
      const expectsHeader = layout !== 'full-content';

      expectNoViewportOverflow(metrics);
      expect(metrics.scroll).not.toBeNull();
      if (!metrics.scroll) {
        throw new Error('Missing layout scroll metrics');
      }
      expect(metrics.scroll.scrollHeight).toBeLessThanOrEqual(
        metrics.scroll.clientHeight + 1,
      );
      expect(metrics.scroll.scrollWidth).toBeLessThanOrEqual(
        metrics.scroll.clientWidth + 1,
      );
      expect(main.width).toBeGreaterThan(0);
      expect(pageContent.height).toBeGreaterThan(0);
      expect(sidebarVisible).toBe(expectsSidebar);
      expect(headerVisible).toBe(expectsHeader);

      const sidebarGap =
        expectsSidebar && metrics.regions.sidebar
          ? Math.abs(metrics.regions.sidebar.right - main.left)
          : 0;
      expect(sidebarGap).toBeLessThanOrEqual(1);
    });
  }

  await updateLayoutPreferences(layoutPage, {
    app: { layout: 'sidebar-nav' },
    sidebar: { collapsed: false },
  });
  const trigger = layoutPage.locator(
    '[data-layout-action="toggle-sidebar-collapse"]',
  );
  const expanded = await getLayoutMetrics(layoutPage);

  await trigger.click();
  await expect(
    layoutPage.locator('[data-layout-region="layout"]'),
  ).toHaveAttribute('data-sidebar-collapsed', 'true');
  await waitForLayoutSettled(layoutPage);
  const collapsed = await getLayoutMetrics(layoutPage);

  expect(requireRegion(collapsed, 'sidebar').width).toBeLessThan(
    requireRegion(expanded, 'sidebar').width,
  );
  expect(requireRegion(collapsed, 'main').width).toBeGreaterThan(
    requireRegion(expanded, 'main').width,
  );

  await trigger.click();
  await waitForLayoutSettled(layoutPage);
});

test('keeps all header modes bound to the layout scroll container', async ({
  layoutPage,
}) => {
  await configureDesktopRolePage(layoutPage);

  for (const mode of HEADER_MODES) {
    await test.step(mode, async () => {
      await updateLayoutPreferences(layoutPage, { header: { mode } });
      await layoutPage.evaluate(() => {
        const scroll = document.querySelector('#__vben_layout_scroll');
        if (scroll instanceof HTMLElement) {
          const spacer = document.createElement('div');
          spacer.dataset.layoutTestSpacer = 'true';
          spacer.style.flex = '0 0 1800px';
          scroll.append(spacer);
        }
      });
      await layoutPage.mouse.move(1000, 500);
      await layoutPage.locator('#__vben_layout_scroll').evaluate((element) => {
        element.scrollTo({ top: 500 });
      });
      await expect
        .poll(() =>
          layoutPage
            .locator('#__vben_layout_scroll')
            .evaluate((element) => element.scrollTop),
        )
        .toBeGreaterThan(0);

      await expect
        .poll(() =>
          layoutPage
            .locator('[data-layout-region="header"]')
            .evaluate((element) => element.getBoundingClientRect().bottom <= 1),
        )
        .toBe(mode !== 'fixed');

      await layoutPage.evaluate(() => {
        document.querySelector('[data-layout-test-spacer="true"]')?.remove();
        document.querySelector('#__vben_layout_scroll')?.scrollTo({ top: 0 });
      });
      await waitForLayoutSettled(layoutPage);
    });
  }
});

test('animates the mobile sidebar without changing the desktop collapse state', async ({
  layoutPage,
}) => {
  await configureDesktopRolePage(layoutPage);
  await layoutPage.emulateMedia({ reducedMotion: 'no-preference' });
  await layoutPage.setViewportSize({ height: 844, width: 390 });
  const layout = layoutPage.locator('[data-layout-region="layout"]');
  await expect(layout).toHaveAttribute('data-mobile', 'true');
  await expect(layout).toHaveAttribute('data-sidebar-collapsed', 'true');
  await expect(
    layoutPage.locator('[data-layout-region="sidebar"]'),
  ).toHaveCount(0);

  await layoutPage.locator('[data-layout-action="toggle-sidebar"]').click();
  const sidebar = layoutPage.locator('[data-layout-region="sidebar"]');
  const getAnimatedProperties = () =>
    sidebar.evaluate((element) =>
      element.getAnimations().flatMap((animation) => {
        const effect = animation.effect as KeyframeEffect | null;
        return effect
          ? effect.getKeyframes().flatMap((frame) => Object.keys(frame))
          : [];
      }),
    );
  await expect.poll(getAnimatedProperties).toContain('transform');
  await expect(sidebar).toBeVisible();
  await expect(
    layoutPage.locator('[data-layout-region="sidebar-mask"]'),
  ).toBeVisible();
  const animatedProperties = await getAnimatedProperties();
  expect(animatedProperties).not.toContain('width');

  await layoutPage
    .locator('[data-layout-region="sidebar-mask"]')
    .click({ position: { x: 380, y: 400 } });
  await expect(sidebar).toHaveCount(0);

  await layoutPage.setViewportSize({ height: 900, width: 1440 });
  await expect(layout).toHaveAttribute('data-mobile', 'false');
  await expect(layout).toHaveAttribute('data-sidebar-collapsed', 'false');
  await expect(sidebar).toBeVisible();
  expect(layoutPage.context().pages()).toHaveLength(1);
});

test('records desktop sidebar performance metrics', async ({
  layoutPage,
}, testInfo) => {
  await configureDesktopRolePage(layoutPage);
  const summary = await measureSidebarPerformance(layoutPage);
  const performanceArtifactPath = testInfo.outputPath(
    'layout-performance.json',
  );
  await writeFile(
    performanceArtifactPath,
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8',
  );
  await testInfo.attach('layout-performance.json', {
    path: performanceArtifactPath,
    contentType: 'application/json',
  });

  expect(summary.runs).toHaveLength(6);
  expect(summary.runs.map((run) => run.direction)).toEqual([
    'collapse',
    'expand',
    'collapse',
    'expand',
    'collapse',
    'expand',
  ]);
  for (const run of summary.runs) {
    expect(run.frameCount).toBeGreaterThanOrEqual(0);
    expect(run.layoutDurationMs).toBeGreaterThanOrEqual(0);
    expect(run.recalcStyleDurationMs).toBeGreaterThanOrEqual(0);
    expect(run.scriptDurationMs).toBeGreaterThanOrEqual(0);
    expect(run.taskDurationMs).toBeGreaterThanOrEqual(0);
  }
});

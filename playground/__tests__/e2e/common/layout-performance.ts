import type { Page } from '@playwright/test';

import { waitForLayoutSettled } from './layout';

interface LayoutPerformanceState {
  active: boolean;
  animationFrames: number[];
  lastFrame: number;
  layoutShifts: number[];
  longAnimationFrames: number[];
  longTasks: number[];
  mainWidths: number[];
  observer?: PerformanceObserver;
}

declare global {
  interface Window {
    __VBEN_LAYOUT_PERFORMANCE__?: LayoutPerformanceState;
  }
}

interface SidebarPerformanceRun {
  cls: number;
  direction: 'collapse' | 'expand';
  frameCount: number;
  layoutDurationMs: number;
  longAnimationFrameCount: number;
  longTaskCount: number;
  mainWidthChanges: number;
  p95FrameMs: number;
  recalcStyleDurationMs: number;
  scriptDurationMs: number;
  taskDurationMs: number;
}

interface SidebarPerformanceSummary {
  browserVersion: string;
  median: Omit<SidebarPerformanceRun, 'direction'>;
  runs: SidebarPerformanceRun[];
  viewport: null | { height: number; width: number };
}

function median(values: number[]) {
  const sorted = [...values].toSorted((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : (sorted[middle] ?? 0);
}

async function startPerformanceWindow(page: Page) {
  await page.evaluate(() => {
    const state: LayoutPerformanceState = {
      active: true,
      animationFrames: [],
      lastFrame: performance.now(),
      layoutShifts: [],
      longAnimationFrames: [],
      longTasks: [],
      mainWidths: [],
    };
    const supportedTypes = PerformanceObserver.supportedEntryTypes;
    const entryTypes = [
      'layout-shift',
      'long-animation-frame',
      'longtask',
    ].filter((type) => supportedTypes.includes(type));

    if (entryTypes.length > 0) {
      state.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            state.longTasks.push(entry.duration);
          } else if (entry.entryType === 'long-animation-frame') {
            state.longAnimationFrames.push(entry.duration);
          } else if (
            entry.entryType === 'layout-shift' &&
            !(entry as PerformanceEntry & { hadRecentInput: boolean })
              .hadRecentInput
          ) {
            state.layoutShifts.push(
              (entry as PerformanceEntry & { value: number }).value,
            );
          }
        }
      });
      state.observer.observe({ entryTypes });
    }

    window.__VBEN_LAYOUT_PERFORMANCE__ = state;
    function sampleFrame(now: number) {
      if (!state.active) return;
      state.animationFrames.push(now - state.lastFrame);
      state.lastFrame = now;
      const main = document.querySelector('[data-layout-region="main"]');
      if (main instanceof HTMLElement) {
        state.mainWidths.push(main.getBoundingClientRect().width);
      }
      requestAnimationFrame(sampleFrame);
    }
    requestAnimationFrame(sampleFrame);
  });
}

async function stopPerformanceWindow(page: Page) {
  return page.evaluate(() => {
    const state = window.__VBEN_LAYOUT_PERFORMANCE__;
    if (!state) {
      throw new Error('Layout performance window was not started');
    }
    state.active = false;
    state.observer?.disconnect();
    delete window.__VBEN_LAYOUT_PERFORMANCE__;

    const sortedFrames = [...state.animationFrames].toSorted(
      (left, right) => left - right,
    );
    let mainWidthChanges = 0;
    for (const [index, value] of state.mainWidths.entries()) {
      const previous = state.mainWidths[index - 1];
      if (previous !== undefined && Math.abs(value - previous) > 0.25) {
        mainWidthChanges += 1;
      }
    }
    return {
      cls: state.layoutShifts.reduce((sum, value) => sum + value, 0),
      frameCount: state.animationFrames.length,
      longAnimationFrameCount: state.longAnimationFrames.length,
      longTaskCount: state.longTasks.length,
      mainWidthChanges,
      p95FrameMs:
        sortedFrames[
          Math.min(
            sortedFrames.length - 1,
            Math.floor(sortedFrames.length * 0.95),
          )
        ] ?? 0,
    };
  });
}

async function measureSidebarPerformance(
  page: Page,
): Promise<SidebarPerformanceSummary> {
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable');
  const trigger = page.locator(
    '[data-layout-action="toggle-sidebar-collapse"]',
  );

  async function readMetrics() {
    const response = await session.send('Performance.getMetrics');
    return Object.fromEntries(
      response.metrics.map((metric) => [metric.name, metric.value]),
    );
  }

  async function toggle() {
    await page.mouse.move(1000, 100);
    await trigger.click();
    await waitForLayoutSettled(page);
  }

  await toggle();
  await toggle();

  const runs: SidebarPerformanceRun[] = [];
  for (let index = 0; index < 6; index += 1) {
    const before = await readMetrics();
    await startPerformanceWindow(page);
    await toggle();
    const sampled = await stopPerformanceWindow(page);
    const after = await readMetrics();
    const collapsed =
      (await page
        .locator('[data-layout-region="layout"]')
        .getAttribute('data-sidebar-collapsed')) === 'true';

    runs.push({
      ...sampled,
      direction: collapsed ? 'collapse' : 'expand',
      layoutDurationMs:
        ((after.LayoutDuration ?? 0) - (before.LayoutDuration ?? 0)) * 1000,
      recalcStyleDurationMs:
        ((after.RecalcStyleDuration ?? 0) - (before.RecalcStyleDuration ?? 0)) *
        1000,
      scriptDurationMs:
        ((after.ScriptDuration ?? 0) - (before.ScriptDuration ?? 0)) * 1000,
      taskDurationMs:
        ((after.TaskDuration ?? 0) - (before.TaskDuration ?? 0)) * 1000,
    });
  }

  await session.detach();
  const numericKeys = [
    'cls',
    'frameCount',
    'layoutDurationMs',
    'longAnimationFrameCount',
    'longTaskCount',
    'mainWidthChanges',
    'p95FrameMs',
    'recalcStyleDurationMs',
    'scriptDurationMs',
    'taskDurationMs',
  ] as const;
  const medianRun = Object.fromEntries(
    numericKeys.map((key) => [key, median(runs.map((run) => run[key]))]),
  ) as SidebarPerformanceSummary['median'];

  return {
    browserVersion: page.context().browser()?.version() ?? 'unknown',
    median: medianRun,
    runs,
    viewport: page.viewportSize(),
  };
}

export { measureSidebarPerformance };
export type { SidebarPerformanceSummary };

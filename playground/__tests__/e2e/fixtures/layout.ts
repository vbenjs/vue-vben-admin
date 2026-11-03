import type { Page } from '@playwright/test';

import { expect, test as base } from '@playwright/test';

import { authLogin } from '../common/auth';

interface LayoutWorkerFixtures {
  layoutPage: Page;
}

// 无 test fixture：Record<never, never> 是无索引签名的空类型。带字符串
// 索引签名的写法（Record<string, never>）会把任意字符串键视为 test
// fixture、与 layoutPage 这类 worker fixture 冲突；空对象类型告警在此
// 为有意为之，压制。
// oxlint-disable-next-line typescript/no-generated-empty-object-type
const test = base.extend<Record<never, never>, LayoutWorkerFixtures>({
  layoutPage: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        baseURL: 'http://localhost:5555',
        viewport: { height: 900, width: 1440 },
      });
      await context.addInitScript(() => {
        Object.defineProperty(window, '__VBEN_LAYOUT_E2E__', {
          configurable: true,
          value: true,
        });
      });
      const page = await context.newPage();

      try {
        await page.goto('/system/role');
        const layout = page.locator('[data-layout-region="layout"]');
        const login = page.locator('input[name="username"]');
        await login.or(layout).first().waitFor({ state: 'visible' });

        if (await login.isVisible()) {
          await authLogin(page);
          await page.waitForURL((url) => !url.pathname.startsWith('/auth/'));
          await page.goto('/system/role');
        }

        await expect(page).toHaveURL(/\/system\/role$/);
        await layout.waitFor({ state: 'visible' });
        await page.waitForFunction(() => Boolean(window.__VBEN_LAYOUT_TEST__));
        await use(page);
      } finally {
        await page
          .evaluate(async () => {
            await window.__VBEN_LAYOUT_TEST__?.resetPreferences();
          })
          .catch(() => {});
        await context.close();
      }
    },
    { scope: 'worker', timeout: 60_000 },
  ],
});

export { expect, test };

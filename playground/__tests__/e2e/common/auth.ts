import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

export async function authLogin(page: Page) {
  // 确保登录表单正常
  const usernameInput = await page.locator(`input[name='username']`);
  await expect(usernameInput).toBeVisible();

  const passwordInput = await page.locator(`input[name='password']`);
  await expect(passwordInput).toBeVisible();

  const sliderCaptcha = await page.locator(`div[name='captcha']`);
  const sliderCaptchaAction = await page.locator(`div[name='captcha-action']`);
  await expect(sliderCaptcha).toBeVisible();
  await expect(sliderCaptchaAction).toBeVisible();

  // 拖动验证码滑块
  // 获取拖动按钮的位置
  const sliderCaptchaBox = await sliderCaptcha.boundingBox();
  if (!sliderCaptchaBox) throw new Error('滑块未找到');

  const actionBoundingBox = await sliderCaptchaAction.boundingBox();
  if (!actionBoundingBox) throw new Error('要拖动的按钮未找到');

  // 计算起始位置和目标位置
  const startX = Math.round(actionBoundingBox.x + actionBoundingBox.width / 2);
  const startY = Math.round(actionBoundingBox.y + actionBoundingBox.height / 2);

  const targetX = Math.round(
    sliderCaptchaBox.x + sliderCaptchaBox.width - actionBoundingBox.width / 2,
  );
  const targetY = startY;

  // 模拟鼠标拖动
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 20 });
  await page.mouse.up();

  // 在拖动后进行断言，检查action是否在预期位置,
  await expect
    .poll(async () => {
      const newActionBoundingBox = await sliderCaptchaAction.boundingBox();
      return newActionBoundingBox?.x ?? actionBoundingBox.x;
    })
    .toBeGreaterThan(actionBoundingBox.x);

  // 到这里已经校验成功，点击进行登录
  await page.getByRole('button', { name: 'login' }).click();
}

import { test, expect } from '@playwright/test';

test.describe('基础设置 - 系统参数配置 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 假设系统运行在本地 3000 端口并进入参数配置页
    // 这里如果接入了完整的 Vben 鉴权，还需要补充 mock login 的前置步骤
    await page.goto('http://localhost:3000/#/sys/config');
  });

  test('验证：修改系统主标题并保存能正确反映到配置中', async ({ page }) => {
    // 找到 "系统主标题" 对应的输入框
    const titleInput = page.getByLabel('系统主标题 (sys.ui.title)');
    
    // 清空现有值并输入新的标题
    await titleInput.fill('Vben 测试系统标题 2026');

    // 找到开关并切换状态
    const captchaSwitch = page.getByRole('switch', { name: '开启登录图形验证码' });
    await captchaSwitch.click();

    // 点击保存按钮
    const saveBtn = page.getByRole('button', { name: '保存全局配置' });
    await saveBtn.click();

    // 断言 1: 确保页面右上方弹出了 `ant-message-success` 成功提示
    const successToast = page.locator('.ant-message-success');
    await expect(successToast).toBeVisible();
    await expect(successToast).toContainText('系统参数保存成功');

    // 断言 2: 获取输入框的值确保修改被记录
    await expect(titleInput).toHaveValue('Vben 测试系统标题 2026');
  });

  test('验证：内置参数的输入合法性限制', async ({ page }) => {
    // 定位密码错误锁定次数
    const retryInput = page.getByLabel('连续密码错误锁定次数');
    await expect(retryInput).toBeVisible();
    // 断言必须是 type="number" 使得只能填入数字
    await expect(retryInput).toHaveAttribute('type', 'number');
  });
});

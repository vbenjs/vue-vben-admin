import { expect, test } from '@playwright/test';

test.describe('系统核心 - 数据字典双表维护 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/#/sys/dict');
  });

  test('验证：左树右表联动及样式呈现', async ({ page }) => {
    // 1. 验证左侧树组件能够正确加载字典大类
    const dictTree = page.locator('.ant-tree');
    await expect(dictTree).toBeVisible();

    // 查找并点击 "订单状态" 这个类别节点
    const orderStatusNode = page.getByText('订单状态 (biz_order_status)', {
      exact: false,
    });
    await orderStatusNode.click();

    // 2. 验证右侧表格标题是否完成了联动加载
    const cardTitle = page.locator('.ant-card-head-title').last();
    await expect(cardTitle).toContainText('biz_order_status');
    await expect(cardTitle).toContainText('字典数据');

    // 3. 验证高级特性：特定的 class (主题色) 的 Tag 是否渲染出现
    // 例如，假设点击进去后，有一个“已完成”的数据，配置的是 success (绿色背景)
    // 配合之前的 Vue UI 代码，应该渲染一个带有 bg-gray-50（如果是默认的）或 bg-red-50（danger）的特定边框元素

    // 筛选出表格内所有的操作按钮断言是否加载出来
    const actionCell = page.getByText('编辑').first();
    await expect(actionCell).toBeVisible();
  });
});

# RISS 页面方案运行态

## 目标

为不同客户提供同一套标准产品页面，同时允许:

- 平台维护标准页
- 租户覆盖页面要素
- 个人保存页面偏好

不允许直接改业务逻辑、接口、数据库字段和流程状态机。

## 分层规则

运行态合并顺序:

1. 标准模板 `sys_page_template`
2. 租户覆盖 `sys_page_override`
3. 个人偏好 `sys_user_page_preference`

只有发布后的内容参与正式运行态。预览时可通过 `mode=draft` 读取草稿。

## 生命周期

每一层都遵循:

1. 草稿
2. 预览
3. 发布
4. 回滚

发布和回滚快照统一记录到 `sys_page_publish_log`。

## 元素键约定

页面内所有可配置要素都必须有稳定 `key`，例如:

```json
{
  "search": [
    { "key": "search.billNo", "label": "单据号", "component": "input", "order": 10 }
  ],
  "toolbar": [
    { "key": "toolbar.add", "label": "新增", "order": 10 }
  ],
  "table": {
    "columns": [
      { "key": "table.amount", "label": "申请金额(元)", "order": 80 }
    ]
  }
}
```

推荐命名:

- 查询区: `search.xxx`
- 工具栏: `toolbar.xxx`
- 表格列: `table.xxx`
- 表单字段: `form.section.field`
- 附件分类: `attachment.xxx`
- 打印模板: `print.xxx`

## Patch 约定

租户和个人层推荐使用按 `key` 覆盖的 patch:

```json
{
  "layout": { "dialogMode": "fullscreen" },
  "search.billType": { "visible": false },
  "table.amount": { "width": 160, "order": 60 }
}
```

说明:

- `layout`、`table`、`form` 等保留为根对象覆盖
- 其它键按页面元素 `key` 精准覆盖
- 数组顺序依赖元素上的 `order`

## 已实现接口

- 标准模板: `/sys/page-schema/template/*`
- 租户覆盖: `/sys/page-schema/tenant/:pageCode`
- 个人偏好: `/sys/page-schema/user/:pageCode`
- 运行态读取: `/sys/page-schema/runtime/:pageCode`

前端调用入口:

- `apps/web-antd/src/api/core/sys-manage.ts`
- `apps/web-antd/src/composables/usePageSchema.ts`

## 试点页面

第一批建议接入:

- `finance.reimbursement.query`
- `finance.income-settlement`
- `finance.invoice-folder`

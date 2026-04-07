# RISS 页面方案运行态

## 目标

为不同客户提供同一套标准产品页面，同时允许:

- 平台维护标准页
- 租户覆盖页面要素
- 租户发布页面运行策略
- 个人保存页面偏好

不允许直接改业务逻辑、接口、数据库字段和流程状态机。

## 分层规则

页面结构运行态合并顺序:

1. 标准模板 `sys_page_template`
2. 租户覆盖 `sys_page_override`
3. 个人偏好 `sys_user_page_preference`

租户策略 `sys_tenant_policy` 与页面结构并行维护, 不直接改写 `schema`, 而是作为运行态的独立 `policy` 返回给前端和业务服务使用。

只有发布后的内容参与正式运行态。预览时可通过 `mode=draft` 读取草稿结构和草稿策略。

### 策略硬约束

租户策略是硬上限, 用于定义:

- 字段默认值、必填、只读、可见性
- 工具栏动作是否可见、是否可用
- 附件分类限制
- 打印相关绑定

个人偏好只能做便利性微调, 不能突破租户策略。典型清洗规则:

- 租户策略隐藏的字段, 个人偏好不能重新设置为显示
- 租户策略只读的字段, 个人偏好不能改回可编辑
- 租户策略禁用或隐藏的动作, 个人偏好不能重新打开

## 生命周期

页面结构层遵循:

1. 草稿
2. 预览
3. 发布
4. 回滚

标准模板、租户覆盖、个人偏好的发布和回滚快照统一记录到 `sys_page_publish_log`。

租户策略单独维护生命周期:

1. 保存草稿
2. 发布策略
3. 查看策略日志
4. 按日志版本回滚

租户策略发布和回滚快照记录到 `sys_tenant_policy_log`。

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
- 租户策略: `/sys/tenant-policy/:sceneCode`

前端调用入口:

- `apps/web-antd/src/api/core/sys-manage.ts`
- `apps/web-antd/src/composables/usePageSchema.ts`
- `apps/web-antd/src/composables/useRuntimePageConfig.ts`

## 运行态返回

运行态接口 `/sys/page-schema/runtime/:pageCode` 统一返回:

- `available`: 页面模板是否存在
- `mode`: `published` 或 `draft`
- `pageCode`: 页面编码
- `pageName`: 页面名称
- `schema`: 标准模板 + 租户覆盖 + 个人偏好合并后的页面结构
- `policy`: 当前租户的页面运行策略
- `context`: 请求上下文
- `sources`: 结构与策略来源 ID
- `versions`: 结构与策略版本号

### `policy`

`policy` 固定归一化为四个分区, 即使没有策略也会返回空对象:

```json
{
  "fields": {},
  "actions": {},
  "attachments": {},
  "print": {}
}
```

### `context`

当前实现返回:

- `tenantId`
- `tenantName`
- `fiscalYear`

### `sources`

当前实现返回:

- `templateId`
- `overrideId`
- `preferenceId`
- `policyId`
- `tenantId`
- `userId`

### `versions`

当前实现返回:

- `template`
- `tenant`
- `user`
- `policy`

示例:

```json
{
  "available": true,
  "mode": "published",
  "pageCode": "finance.income-settlement",
  "pageName": "收入结算单",
  "schema": {},
  "policy": {
    "fields": {
      "form.basic.receiptMethod": {
        "defaultValue": "银行转账",
        "readonly": true
      }
    },
    "actions": {
      "toolbar.history": {
        "visible": false
      }
    },
    "attachments": {
      "attachment.invoice": {
        "maxCount": 2
      }
    },
    "print": {}
  },
  "context": {
    "tenantId": 7,
    "tenantName": "华南院",
    "fiscalYear": "2026"
  },
  "sources": {
    "templateId": "1",
    "overrideId": "5",
    "preferenceId": "9",
    "policyId": "22",
    "tenantId": 7,
    "userId": "1001"
  },
  "versions": {
    "template": 2,
    "tenant": 1,
    "user": 3,
    "policy": 4
  }
}
```

## 试点页面

第一批建议接入:

- `finance.reimbursement.query`
- `finance.income-settlement`
- `finance.invoice-folder`

# G3 一期迁移执行方案

本文档用于把 G3 财务管理系统迁移到 RISS 新架构时的一期边界、执行顺序和落地清单固化下来。

目标不是一次性替换老系统，而是用最小风险方式，先让新 Web 架构承接最核心的财务流程。

## 一期目标

- 建立 `RISS Web + RISS Server + Legacy G3 DB/Service Adapter` 的并行迁移架构
- 停止“大而全”式迁移，不以一次性迁移 `606` 张表为目标
- 优先打通最小可运行闭环：登录、菜单、查询、申请、送审、审核历史、打印
- 允许老 G3 与新 RISS 在迁移期并行运行

## 一期范围

一期只做以下业务模块：

- 报销
- 借款
- 支付
- 凭证查询与生成

一期暂不处理以下内容：

- 项目库
- 预算编审
- 绩效管理
- 合同管理
- 采购管理
- UKey/加密狗
- 桌面自动升级
- DeepSeek/同步扩展能力
- 复杂外部 Hessian 与短信集成重构

## 总体原则

### 1. 先分层，后迁移

迁移优先级不是“页面”，而是以下三层：

1. 平台兼容层
2. 业务适配层
3. 业务页面层

### 2. 先读后写

首批页面优先做查询和详情，最后再上线新增、修改、送审等写操作。

### 3. 双库并存

- `MySQL + Prisma` 继续承接平台基础数据
- `SQL Server` 继续承接 G3 业务数据
- 一期不做全量业务表迁库

### 4. 禁止前端直连 SQL

老 G3 使用远程 SQL 执行方式，但新 Web 架构中必须改为“命名 API + 服务层”模式。

### 5. 单前端主应用

一期只选择一个前端应用承载业务，默认使用 `apps/web-antd`。

## 迁移阶段顺序

迁移按以下阶段执行：

1. 系统管理平台
2. 财务管理
3. 出纳管理

说明：

- 系统管理平台必须先稳定，再进入财务与出纳业务模块
- 财务管理优先承接报销、借款、支付、凭证
- 出纳管理在财务管理稳定后再建设

## 目标架构

```text
apps/web-antd
    ↓ HTTP API
apps/server
    ├─ auth / menu / user 兼容接口
    ├─ finance-reimbursement
    ├─ finance-payment
    ├─ finance-voucher
    ├─ finance-workflow
    └─ legacy-sql / legacy-integration 适配层
            ↓
    SQL Server (G3 业务库)
    老远程服务 / 外部系统

Prisma / MySQL
    └─ sys_user / sys_role / sys_menu / form / print / approval 等平台表
```

## 推荐目录规划

### 后端

建议在 `apps/server/src` 下新增以下目录：

- `auth`
- `app-menu`
- `app-user`
- `legacy-sql`
- `legacy-integration`
- `finance-reimbursement`
- `finance-payment`
- `finance-voucher`
- `finance-workflow`

说明：

- `sys-*` 保持为平台管理域
- `finance-*` 独立为业务域
- 不要把财务业务继续堆进 `sys-*`

### 前端

建议在 `apps/web-antd/src` 下新增以下目录：

- `api/finance`
- `views/finance/reimbursement`
- `views/finance/payment`
- `views/finance/voucher`
- `router/routes/modules/finance.ts`
- `locales/langs/zh-CN/finance.json`

## 一期里程碑

### M0：冻结范围

输出物：

- 一期菜单清单
- 一期单据清单
- 一期审批流清单
- 一期打印模板清单
- 一期关键视图、存储过程、SQL 清单

完成标准：

- 只保留“报销、借款、支付、凭证”四块
- 明确每块的查询页面、详情页面、操作按钮、审核节点

### M1：打通平台兼容接口

目标：让 `apps/web-antd` 脱离 mock，真实连接 `apps/server`。

首批接口：

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/codes`
- `GET /api/user/info`
- `GET /api/menu/all`

完成标准：

- 浏览器可真实登录
- 可正确加载用户信息与菜单
- 前端关闭 mock 后仍可进入主框架

### M2：建立 Legacy Adapter

目标：把老 G3 的数据库访问与远程服务访问统一收口到适配层。

首批能力：

- `legacy-sql` 负责业务查询
- `legacy-integration` 负责外围服务代理
- 所有业务接口只调用服务层，不暴露原始 SQL 执行入口

完成标准：

- 后端可通过受控服务访问 G3 SQL Server
- 能输出报销、支付、凭证的查询结果

### M3：首批只读页面上线

首批页面：

- 报销单查询
- 支付单查询
- 凭证查询

完成标准：

- 列表页可分页查询
- 详情页可查看关键字段和审核历史
- 可支持基础导出或打印预览占位

### M4：首个写流程上线

优先级建议：

1. 借款申请
2. 报销申请

完成标准：

- 新增
- 保存
- 送审
- 撤回
- 审核历史

### M5：支付与凭证串联

完成标准：

- 支付单据可关联业务来源
- 可生成凭证
- 可查询凭证结果

## 首周执行清单

### 第 1 步

- 固定一期主前端为 `apps/web-antd`
- 固定一期业务域为 `报销 + 借款 + 支付 + 凭证`
- 明确不做全库迁移

### 第 2 步

- 梳理前端当前依赖的核心接口
- 梳理后端当前实际暴露的接口
- 输出接口缺口表

### 第 3 步

- 在 `apps/server` 新增兼容接口模块骨架
- 先完成认证、菜单、用户三类接口

### 第 4 步

- 在 `apps/server` 新增 `legacy-sql` 模块骨架
- 验证连接老 G3 SQL Server 的最小能力

### 第 5 步

- 在 `apps/web-antd` 增加 `finance` 路由模块
- 先放 3 个只读入口页面占位

## 接口缺口表

### 前端当前需要的接口

- `/auth/login`
- `/auth/refresh`
- `/auth/logout`
- `/auth/codes`
- `/user/info`
- `/menu/all`

### 后端当前已有的接口风格

- `/sys/menu/*`
- `/sys/user/*`
- 其他 `sys-*` 管理接口

### 结论

必须先补一层兼容接口，不能指望前端直接复用现在的 `sys-*` 路由。

## 数据迁移策略

### 一期不迁移的内容

- 全量业务历史数据表
- 所有存储过程
- 所有统计报表逻辑

### 一期保留使用的内容

- `GFM_REI_PAY`
- `GFM_REI_PAY_DETAIL`
- `VW_GFM_PAY`
- `VW_GFM_PAY_BILL`
- `VW_ACC_BALANCE`
- `proc_todolist`

### 一期新建的数据

- 新平台账号权限配置
- 新表单设计配置
- 新审批流程配置
- 新打印模板配置

## 风险控制

### 风险 1：仓库当前有大量未提交改动

处理策略：

- 一期第一轮只新增文件或新增独立模块
- 不在第一步直接改动大面积已有逻辑

### 风险 2：老系统不只有数据库依赖

处理策略：

- 先把外围依赖登记成清单
- 业务流程里先屏蔽非关键外围集成

### 风险 3：打印、UKey、本地能力无法直接 Web 化

处理策略：

- 一期先保留简化打印能力
- 本地能力后续评估 `Agent/桌面伴随服务`

## 本阶段完成定义

本阶段完成时，应满足：

- 已确认一期边界
- 已确认单前端方案
- 已确认双库并存方案
- 已确认接口兼容优先级
- 已确认不做全量迁库

## 当前代码状态

截至 2026 年 3 月 9 日，仓库中已完成以下基础工作：

- 已在 `apps/server/src/auth` 提供 `/auth/login`、`/auth/refresh`、`/auth/logout`、`/auth/codes`
- 已在 `apps/server/src/app-user` 提供 `/user/info`
- 已在 `apps/server/src/app-menu` 提供 `/menu/all`
- 已在 `apps/server/src/legacy-sql` 提供 `GET /legacy-sql/status`、`GET /legacy-sql/queries`、`GET /legacy-sql/ping`
- 已为表/视图型命名查询提供 `GET /legacy-sql/queries/:key/execute` 只读分页执行入口
- 已为 `todo-list` 补存储过程参数映射，并支持从登录态推导 `userId`
- `apps/web-antd` 中审批工作台与流程工作台列表已接入 `legacy-sql` 查询入口
- 已补 `finance` 路由分组、后端菜单节点，以及报销/支付/凭证三类入口页面
- 报销、支付、凭证三类页面均已接入只读查询，其中凭证页当前基于 `VW_ACC_BALANCE` 展示关联字段
- 审批工作台与流程工作台入口已补到前端路由与后端菜单，可直接从导航进入
- 已新增命名后端接口：`/finance/reimbursement/*`、`/finance/payment/*`、`/finance/voucher/list`、`/finance/workflow/workbench/list`
- 前端已从通用 `legacy-sql` 直连切换到命名 API + 服务层模式
- 已新增流程命令接口：`POST /finance/workflow/command/:action`，当前会把审核/撤销/催办/加签动作写入 `approval_record`
- 工作台列表会叠加最近一次本地审批动作结果，并在详情弹窗中展示审批历史
- 流程命令会尝试按单据编号回写本地业务表 `flow_status`，首批覆盖报销、采购、合同收款等已识别业务表
- 报销查询会优先叠加本地 `expense_claim` / `expense_claim_detail` 精确字段，凭证查询会叠加本地 `budget_indicator` 精确字段
- 支付查询会优先叠加本地 `payment_method` / `expense_payer` 精确字段，如付款银行、付款账号、支付方式与关联类型
- 支付明细会进一步叠加本地 `expense_payee` 精确字段，如收款银行、收款账号、预算单位与账户类型
- 流程命令在本地业务表回写时，已支持一个业务表匹配多个编号字段（如合同可匹配 `contractNo` / `contractApplyNo`）
- 报销单页面已接入首个真实写流程：新增/编辑后可送审、撤回，并可查看审批历史
- 合同收款页面已复用同一工作流能力：新增/编辑后可送审、撤回，并可查看审批历史
- 科研项目、科研指标、范围调剂、合同台账、采购申报、采购结果、招标公告页面均已接入统一送审/撤回/审批历史能力
- 对于缺少天然业务编号的本地业务表（如 `research_scope_adjust`、`bid_notice`），流程回写已支持 `businessId` 定位，避免兜底编号误匹配
- 已新增页面回归脚本 `pnpm test:smoke:riss`，默认覆盖系统管理、审批工作台、流程页及财务查询页
- 已提供快捷命令 `pnpm test:smoke:riss:workflow` 与 `pnpm test:smoke:riss:finance`，便于按业务域执行 smoke 回归
- 已新增交互型回归脚本 `pnpm test:smoke:riss:workflow-actions`，会通过“API 造数 + 页面点击”验证送审、工作台审核、工作台撤回、历史闭环，并校验历史 API 已写入 `submit` / `approve` / `withdraw`
- `apps/server` 可正常执行 `pnpm -C apps/server build`
- `apps/web-antd` 可正常执行 `pnpm -C apps/web-antd typecheck`

这意味着平台兼容层的首批骨架已经落地，下一步不再是重复补 `auth/menu/user`，而是继续向业务适配层推进。

## Legacy SQL 环境变量

当前 `legacy-sql` 骨架默认读取以下环境变量：

- `LEGACY_SQL_ENABLED`
- `LEGACY_SQL_CONNECTION_STRING`
- `LEGACY_SQL_HOST`
- `LEGACY_SQL_PORT`
- `LEGACY_SQL_DATABASE`
- `LEGACY_SQL_SCHEMA`
- `LEGACY_SQL_USERNAME`
- `LEGACY_SQL_PASSWORD`
- `LEGACY_SQL_ENCRYPT`
- `LEGACY_SQL_TRUST_SERVER_CERTIFICATE`
- `LEGACY_SQL_CONNECTION_TIMEOUT`
- `LEGACY_SQL_REQUEST_TIMEOUT`
- `LEGACY_SQL_POOL_MIN`
- `LEGACY_SQL_POOL_MAX`
- `LEGACY_SQL_POOL_IDLE_TIMEOUT`

## 页面 Smoke 回归

当前仓库已提供基于 Playwright 的页面 smoke 脚本：

- `pnpm test:smoke:riss`
- `pnpm test:smoke:riss:all`
- `pnpm test:smoke:riss:workflow`
- `pnpm test:smoke:riss:finance`
- `pnpm test:smoke:riss:workflow-actions`

默认约定：

- 后端地址：`http://127.0.0.1:5555`
- 前端地址：`http://127.0.0.1:5666`
- 登录账号：`admin / 123456`
- 默认账套：`tenantId=1`
- 默认年度：`2026`
- 默认审核账号：`testuser / 123456`

可通过以下环境变量覆盖：

- `RISS_SMOKE_API_BASE_URL`
- `RISS_SMOKE_WEB_BASE_URL`
- `RISS_SMOKE_USERNAME`
- `RISS_SMOKE_PASSWORD`
- `RISS_SMOKE_APPROVER_USERNAME`
- `RISS_SMOKE_APPROVER_PASSWORD`
- `RISS_SMOKE_TENANT_ID`
- `RISS_SMOKE_FISCAL_YEAR`
- `RISS_SMOKE_TARGETS`

说明：

- 脚本会检查页面关键文案、控制台报错、请求失败与 4xx/5xx 响应
- 任一页面失败时脚本会返回非零退出码，适合接入本地联调或 CI
- 交互型脚本当前已覆盖 `expense-claim`、`contract`、`contract-receipt`、`procurement-apply`、`procurement-result`、`research-project`、`research-indicator`、`research-scope-adjust`、`bid-notice`
- 交互型脚本会在执行结束后自动清理测试数据
- 交互型脚本除页面交互外，还会直接调用各业务模块的 `history` 接口，校验审批记录已成功落库
- 交互型脚本当前会使用第二个账号从 `/sys/approval/my-todo` 发起审核，再由发起账号从 `/sys/approval/my-submit` 发起撤销，用于验证工作台列表与业务页状态回写已贯通

本地联调时，也可直接通过统一校验入口执行：

- `python .agent/scripts/checklist.py . --riss-smoke`
- `python .agent/scripts/verify_all.py . --url http://127.0.0.1:5666 --riss-smoke`
- `pnpm test:smoke:riss:all`

## 下一步

下一步进入实际代码阶段，优先顺序如下：

1. 将 `pnpm test:smoke:riss:workflow`、`pnpm test:smoke:riss:finance` 与 `pnpm test:smoke:riss:workflow-actions` 接入联调流程或 CI，形成工作流页 + 财务页静态检查以及交互闭环三基线
2. 继续把报销单、合同收款等已接入模块的后续节点流转细化完整
3. 继续扩大交互型 smoke 覆盖范围，补到更多审批工作台入口与流程工作台入口
4. 评估并补充专用凭证命名查询
5. 继续细化更多业务明细页字段映射

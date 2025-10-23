# AI 助手现状与规划（Sharded）

源自：../prd.md:418

## 现状
- 前端已提供 `AI 助手 · 对话` 视图（`apps/web-antd/src/views/ai-assistant/chat/index.vue`），支持通过路由 `url|base|token|inputs|hideBrand` 参数或环境变量构建 iframe 地址，具备 Loading/错误兜底与“品牌遮挡（可选）”能力。
- `inputs` 支持按键值在浏览器侧进行 `gzip + base64 + encodeURIComponent` 编码（CompressionStream 可用则启用），用于 Dify 的兼容性输入。

## 规划
- M1：引入与后端的 PostMessage 双向通信与服务端签名（traceId、nonce、ts、HMAC），统一 CardSchema 与 Action 执行路径（只读动作优先）。
- M2：动作执行前置 RBAC/ABAC 判定、草稿/二次确认/审批联动；支持“转离线任务”降级；卡片版本化与向后兼容。
- M3：统一命令面板/全局搜索与对话的语义对齐，形成“直达视图/动作”的一致体验；可观测性打通（cards/actions 级指标）。

## 端到端验收脚本模板（GWT 对齐）

以下模板用于 Playwright E2E 场景编写，与 PRD 的 GWT 标准一致。落脚点在 `apps/web-antd` 与（可选）`apps/backend-mock`。

场景 A：对话视图加载与 PostMessage 握手
- Given 已配置 Dify `base/token` 与开启签名通道特性开关
  When 访问“AI 助手 · 对话”视图并等待 iframe 加载完成
  Then 前端向 iframe 发送 handshake 消息并在 3s 内收到 ack，UI 展示可输入状态

场景 B：inputs 编码链路（gzip + base64 + encodeURIComponent）
- Given 浏览器支持 CompressionStream 且启用 inputs 压缩
  When 发送包含复杂 `inputs` 的请求
  Then 实际传输体已按约定编码，并被对端成功解码

场景 C：签名通道与权限前置校验
- Given 后端暴露签名接口，权限网关返回允许
  When 在对话中点击“操作卡片 · 生成报表”
  Then 前端携带签名调用通过，返回执行结果卡片并记录审计

场景 D：权限拒绝与错误卡片退化
- Given 权限网关配置为拒绝目标动作
  When 在对话中执行“提交审批”
  Then 返回“无权限”卡片并写入审计；无页面异常

场景 E：Dify 不可用时的降级
- Given Dify 服务超时或 5xx
  When 发送对话请求
  Then 在 2s 内展示错误卡片，并给出“使用模板/缓存结果”按钮

场景 F：卡片操作 + 表单片段 + 二次确认
- Given 对话返回“操作卡片（提交报表）”且需要补充参数
  When 打开表单片段填写并确认
  Then 通过 ActionBus 执行动作并返回结果卡片，期间出现二次确认

场景 G：性能预算（首 token 延迟）
- Given 网络与后端稳定
  When 发送一条常规问答
  Then 首 token 延迟 P95 ≤ 800ms（以 20 次取样）

场景 H：特性开关回退（直连 iframe 模式）
- Given 关闭签名通道开关
  When 重新进入对话页
  Then 使用直连模式仍可完成基本问答，且无签名调用

脚手架建议
- 目录：`playground/__tests__/e2e/ai-assistant.spec.ts`
- 夹具：公司上下文、签名服务开关、权限网关策略、Dify 可用性
- 断言：卡片标题/状态按钮、审计提示文案、首 token 计时、请求拦截验签


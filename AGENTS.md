# Repository Guidelines

- 主应用位于 `apps/web-ele/`，关键目录包括 `src/api`（类型化 API 层）、`src/adapter`（多 UI 适配器）、`src/router`、`src/store` 与 `src/views`。合并特性时保持模块内组件、状态、路由同层存放。
- 共享能力集中于 `packages/`：`@core` 处理框架胶水，`stores`、`types`、`utils`、`styles` 提供跨应用资源，务必通过工作区别名导入。
- `internal/` 存放构建脚本与 Turbo 配置，`docs/` 为 VitePress 文档，`playground/` 收录 vben 官方脚手架示例，可参考其封装的表单、表格等高阶能力。
- Tailwind 与共享样式变量位于 `packages/styles`，若新增主题 token 请同步更新 Element Plus 自定义主题文件。

- `pnpm install` 安装所有工作区包（preinstall 强制 pnpm）；推荐 Node ≥ 20.10，pnpm ≥ 9.12。
- `pnpm dev` 由 Turbo 管理多端开发；若只调试 Element Plus 栈，运行 `pnpm --filter @vben/web-ele dev`。
- `pnpm build` 产出生产包，配合 `pnpm --filter @vben/web-ele build` 或 `pnpm build:analyze` 细化分析。
- `pnpm check` 汇总循环依赖、依赖健康、类型与拼写检查；`pnpm lint` / `pnpm lint:fix` / `pnpm format` 应用 ESLint、Stylelint、Prettier 统一规范。
- 修改或合并代码后，请务必执行 `pnpm format` 以统一代码风格，然后执行`pnpm check`检查代码正确性。
- `pnpm preview` 使用 Vite 预览产物；部署镜像可通过 `pnpm build:docker` 与 `scripts/deploy` 目录脚本完成。

## 代码风格与命名规范

- 遵循 `eslint.config.mjs` 与 `@vben/prettier-config`：TypeScript + `<script setup>`、2 空格缩进、单引号、自动排序导入。
- Vue 组件使用 PascalCase 命名并以 `user-profile.vue` 形式落盘；Pinia store、常量命名请带域前缀（如 `user.`、`APP_`）以匹配共享包约定。
- 表单与表格推荐使用 `useVbenForm`、`useVbenVxeGrid` 组合；在 `packages` 内新增能力时提供类型定义与示例便于复用。

## 测试规范

- 单元测试基于 Vitest（`pnpm test:unit`），测试文件与源码同层命名为 `*.test.ts` / `*.spec.ts`，必要时使用 happy-dom。
- 端到端测试使用 Playwright（`pnpm test:e2e`）；场景按应用拆分，提交 PR 时附上失败截图或 trace 记录。
- 开发认证链路时同时启动 `apps/backend-mock`，覆盖登录、刷新 Token、权限路由等关键路径，如存在覆盖空缺请在 PR 描述说明。

## 提交与 Pull Request 指南

- 提交信息遵循 Conventional Commits，可通过 `pnpm commit` (`czg`) 辅助，常见 scope 包括 `feat(web-ele)`、`fix(utils)` 等。
- PR 需包含：变更摘要、运行的关键命令结果（如 `pnpm check`、测试输出）、相关 issue/讨论引用以及 UI 变更截图。
- 至少请求一位审阅者，说明环境或配置改动（如 `.env`、mock 数据），并列出后续待办或已知限制。

## 安全与配置提示

- 配置文件使用 `.env` / `.env.local`，切勿提交真实密钥；JWT 流程依赖 refresh token，请同步更新 mock 与真实后端接口。
- 新增第三方依赖前先运行 `pnpm check:dep`，确保不会破坏 monorepo 的版本策略或 catalog 锁定。

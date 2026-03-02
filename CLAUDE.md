# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 技术栈

1. 基于 **pnpm workspaces** + **Turborepo** 的 Vue 3 + TypeScript + Vite monorepo 项目。
2. 提供多个 UI 组件库版本（Ant Design Vue、Element Plus、Naive UI、TDesign），共享同一套使用tailwindcss+shadcn-vue的UI组件库核心框架。
3. 要求 Node ≥ 20.19.0，pnpm ≥ 10。
4. 使用 **prettier** + **eslint** + **stylelint** 进行代码检查和格式化。
5. 使用 **vitest** 进行单元测试。
6. 使用 **playwright** 进行E2E测试。
7. 使用 **commitlint** 进行提交规范。
8. 使用 **czg** 进行提交规范。
9. 使用 **lefthook** 进行提交规范。
10. 使用 **vsh** 进行代码检查和格式化。
11. 使用 **turbo** 进行构建。
12. 使用 **vite** 进行开发。
13. 使用 **vue-tsc** 进行类型检查。
14. 使用 **vue-test-utils** 进行单元测试。
15. 使用 **playwright** 进行E2E测试。

# 其他检查
pnpm check:circular # 循环依赖扫描
pnpm check:dep      # depcheck 依赖检查
pnpm check:cspell   # 拼写检查

# 清理
pnpm clean          # 删除 dist、node_modules 等产物
pnpm reinstall      # clean + 重新安装

# 交互式规范提交
pnpm commit         # czg 提交向导
```

Turbo 任务通过 `dependsOn: ["^build"]` 级联，构建某个应用时会自动先构建其所有依赖包。

## Monorepo 目录结构

```
apps/
  backend-mock/     # 基于 Nitro 的 mock API 服务（h3 路由 + faker.js 数据）
  web-antd/         # Ant Design Vue 应用
  web-ele/          # Element Plus 应用
  web-naive/        # Naive UI 应用
  web-tdesign/      # TDesign Vue 应用

packages/
  @core/            # 框架核心（不依赖具体 UI 库）
    base/           # 共享工具、缓存、颜色处理、类型定义
    composables/    # 核心 Vue composable
    preferences/    # PreferenceManager 类（响应式、持久化配置）
    ui-kit/         # UI 组件片段：form-ui、layout-ui、menu-ui、popup-ui、shadcn-ui、tabs-ui
  effects/          # 高层模块，可依赖 @core 和 UI 库
    access/         # 路由/菜单生成与权限指令
    common-ui/      # 通用 UI 组件（ApiComponent、IconPicker、VCropper、Tippy 等）
    hooks/          # useAppConfig 等
    layouts/        # BasicLayout、登录页、各类 widgets
    plugins/        # Motion 等插件
    request/        # RequestClient（axios 封装 + 拦截器体系）
  constants/        # 全局常量（LOGIN_PATH 等）
  icons/            # Iconify 图标封装
  locales/          # vue-i18n 初始化、loadLocalesMap 工具
  preferences/      # 对外暴露 @core/preferences 的公共 API
  stores/           # Pinia 全局 store：useAccessStore、useUserStore、useTabbarStore
  styles/           # 全局 CSS / TailwindCSS 基础样式
  types/            # 共享 TypeScript 类型
  utils/            # 共享工具函数（mergeRouteModules、mapTree 等）

internal/
  lint-configs/     # ESLint、Prettier、Stylelint、commitlint 配置包
  node-utils/       # 构建时 Node 工具
  tailwind-config/  # 共享 Tailwind 配置
  tsconfig/         # 基础 tsconfig
  vite-config/      # 共享 Vite 配置工厂 + 插件集合

scripts/
  vsh/              # CLI 工具（lint、check-dep、check-circular、publint）
  turbo-run/        # 交互式 turbo 运行器

playground/         # 组件演示场
docs/               # VitePress 文档
```

## 核心架构说明

### 应用启动流程

每个应用的 `src/main.ts` 调用 `bootstrap(namespace)`（位于 `src/bootstrap.ts`），依次执行：

1. 初始化**组件适配器**（`src/adapter/component/index.ts`）——将通用表单组件名映射到具体 UI 库的组件。
2. 调用 `initSetupVbenForm()`（`src/adapter/form.ts`）配置通用表单系统。
3. 依次初始化 i18n、Pinia stores、权限指令、Tippy、路由、MotionPlugin，最后挂载到 `#app`。

### 偏好设置系统

`@vben/preferences` 导出单例 `preferences`（`PreferenceManager`）。它是响应式的，自动持久化到 localStorage（以应用 namespace 为前缀），并驱动主题 CSS 变量的更新。各应用在 `src/preferences.ts` 中调用 `defineOverridesPreferences()` 覆盖默认值，无需修改核心代码。

### 权限/访问系统

`@vben/access`（`packages/effects/access`）支持三种访问模式：

- **frontend**：根据用户角色过滤静态路由。
- **backend**：从接口（`getAllMenusApi`）获取菜单并动态注册路由。
- **mixed**：同时使用以上两种方式。

路由守卫（`src/router/guard.ts`）在登录后首次导航时调用 `generateAccess()`，将结果存入 `useAccessStore`，再重定向到目标页。`v-access` 指令和 `<AccessControl>` 组件用于按权限码或角色控制 UI 元素显示。

### 请求客户端

`@vben/request` 将 Axios 封装为 `RequestClient`。每个应用在 `src/api/request.ts` 中创建自己的实例，挂载以下拦截器：

- **请求拦截**：自动附加 Bearer Token 和 Accept-Language 头。
- **`defaultResponseInterceptor`**：解包 `{ code, data, message }` 响应格式。
- **`authenticateResponseInterceptor`**：处理 401，自动刷新 token 或跳转登录。
- **`errorMessageResponseInterceptor`**：调用 `message.error()` 显示错误。

在 API 文件中从 `#/api/request` 引入 `requestClient`（自动解包响应）或 `baseRequestClient`（原始响应）。

### 路由组织

- `src/router/routes/modules/*.ts`：需要权限验证的动态路由。
- `src/router/routes/core/`：始终可访问的路由（登录页、404 等）。
- `mergeRouteModules(import.meta.glob(...))` 用于聚合路由模块文件。
- 动态路由在运行时由权限系统注册。

### 适配器模式

每个 UI 库应用在 `src/adapter/` 下提供适配器，将 `@vben/common-ui` 的通用 form/modal/drawer 组件桥接到具体组件库。这是 `web-antd`、`web-ele` 等应用之间的主要差异所在。

### 全局 Pinia Store

- `useAccessStore`：token、路由、菜单、锁屏、登录过期状态。
- `useUserStore`：用户信息、角色、homePath。
- `useTabbarStore`：已打开标签页管理。

所有 store 通过 `@vben/stores` 的 `initStores(app, { namespace })` 统一初始化。

### Mock 后端

`apps/backend-mock` 是一个 Nitro 服务器，可单独启动：`pnpm -F @vben/backend-mock start`。Vite 开发服务器通过 `vite.config.ts`（位于 `internal/vite-config`）将 API 请求代理到该服务。

## 开发约定

- **路径别名**：`#/*` 指向各应用的 `./src/*`（在 `package.json#imports` 中定义）。
- **依赖版本管理**：内部包使用 `workspace:*`，第三方包使用 `catalog:`（版本集中在 `pnpm-workspace.yaml#catalog` 中管理）。
- **提交规范**：遵循 Conventional Commits（`feat`、`fix`、`chore`、`docs`、`refactor`、`perf`、`test`、`ci`、`style`、`types`、`revert`），由 lefthook + commitlint 强制执行。
- **pre-commit 钩子**（lefthook）：自动对暂存文件执行 prettier + eslint + stylelint，推荐使用 `pnpm commit`（czg）提交。
- **新增页面**：在 `src/views/` 下创建 `.vue` 文件，在 `src/router/routes/modules/` 下添加路由模块；若使用 backend 模式，还需确保后端接口返回对应菜单数据。
- **国际化**：统一使用 `$t('key')`，locale 文件位于 `packages/locales/`。

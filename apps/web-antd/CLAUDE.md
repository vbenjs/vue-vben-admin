# CLAUDE.md - Web Antd 应用文档

[根目录](../../../CLAUDE.md) > [apps](../../) > **web-antd**

## 模块职责

Web Antd 是 FactoryOS 的主应用，基于 Ant Design Vue 构建的现代化中后台管理系统。它提供了完整的用户界面、路由管理、状态管理、国际化等功能，是整个系统的前端入口。

## 入口与启动

- **入口文件**: `src/main.ts`
- **引导文件**: `src/bootstrap.ts`
- **配置文件**: `vite.config.mts`
- **启动脚本**: `pnpm dev`
- **构建脚本**: `pnpm build`

## 对外接口

### API 接口

- **认证接口**: `src/api/core/auth.ts`
- **用户接口**: `src/api/core/user.ts`
- **菜单接口**: `src/api/core/menu.ts`
- **请求封装**: `src/api/request.ts`

### 路由结构

- **核心路由**: `src/router/routes/core.ts`
- **仪表盘**: `src/router/routes/modules/dashboard.ts`
- **演示模块**: `src/router/routes/modules/demos.ts`
- **Vben 相关**: `src/router/routes/modules/vben.ts`

## 关键依赖与配置

### 主要依赖

- **@vben/** 系列包: 项目内部共享包
- **ant-design-vue**: UI 框架
- **vue**: 核心框架
- **vue-router**: 路由管理
- **pinia**: 状态管理
- **@vueuse/core**: Vue 组合式工具

### 应用配置

- **偏好设置**: `src/preferences.ts`
- **环境变量**: 通过 Vite 环境变量管理
- **代理配置**: 配置了 `/api` 路径代理到后端 Mock 服务

### 布局组件

- **基础布局**: `src/layouts/basic.vue`
- **认证布局**: `src/layouts/auth.vue`

## 数据模型

### 认证模型

- **登录参数**: `AuthApi.LoginParams { username?, password? }`
- **登录结果**: `AuthApi.LoginResult { accessToken }`
- **刷新令牌**: `AuthApi.RefreshTokenResult`

### 用户模型

- 通过 `@vben/stores` 包管理用户状态
- 支持权限码获取和验证

## 测试与质量

### 测试策略

- 使用 Vitest 进行单元测试
- 使用 Playwright 进行 E2E 测试
- 测试文件位于各模块的 `__tests__` 目录

### 代码质量

- 使用 ESLint 和 Prettier 进行代码规范检查
- TypeScript 严格模式确保类型安全
- 支持类型检查: `pnpm typecheck`

## 国际化

- **配置文件**: `src/locales/index.ts`
- **语言包**: `src/locales/langs/`
- **支持语言**: 中文(zh-CN)、英文(en-US)
- **页面翻译**: `src/locales/langs/*/page.json`
- **演示翻译**: `src/locales/langs/*/demos.json`

## 状态管理

### Store 结构

- **认证状态**: `src/store/auth.ts`
- **主 Store**: `src/store/index.ts`
- 使用 Pinia 进行状态管理，支持持久化

## 视图组件

### 核心视图

- **仪表盘分析**: `src/views/dashboard/analytics/`
- **工作区**: `src/views/dashboard/workspace/`
- **关于页面**: `src/views/_core/about/`

### 认证视图

- **登录**: `src/views/_core/authentication/login.vue`
- **注册**: `src/views/_core/authentication/register.vue`
- **忘记密码**: `src/views/_core/authentication/forget-password.vue`
- **二维码登录**: `src/views/_core/authentication/qrcode-login.vue`

### 错误页面

- **404**: `src/views/_core/fallback/not-found.vue`
- **403**: `src/views/_core/fallback/forbidden.vue`
- **500**: `src/views/_core/fallback/internal-error.vue`
- **网络错误**: `src/views/_core/fallback/offline.vue`

### 演示组件

- **Ant Design 演示**: `src/views/demos/antd/index.vue`

## 适配器层

### 组件适配器

- **表单适配器**: `src/adapter/form.ts`
- **组件适配器**: `src/adapter/component/index.ts`
- **表格适配器**: `src/adapter/vxe-table.ts`

## 常见问题 (FAQ)

### 如何添加新的页面？

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/routes/modules/` 下添加路由配置
3. 在语言包中添加页面标题翻译

### 如何添加新的 API 接口？

1. 在 `src/api/` 下创建接口文件
2. 定义请求参数和响应类型
3. 使用 `requestClient` 或 `baseRequestClient` 发送请求

### 如何自定义主题？

通过 `@vben/preferences` 包进行主题配置，支持亮色/暗色主题切换。

## 相关文件清单

- `src/main.ts` - 应用入口
- `src/bootstrap.ts` - 应用引导
- `src/app.vue` - 根组件
- `src/preferences.ts` - 应用偏好设置
- `src/api/` - API 接口
- `src/router/` - 路由配置
- `src/store/` - 状态管理
- `src/views/` - 视图组件
- `src/layouts/` - 布局组件
- `src/locales/` - 国际化
- `src/adapter/` - 适配器层

## 变更记录 (Changelog)

- 2025-10-15: 初始化应用文档

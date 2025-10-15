# CLAUDE.md - Effects 效果包文档

[根目录](../../../CLAUDE.md) > [packages](../../) > **effects**

## 模块职责

Effects 是 FactoryOS 的功能效果包集合，提供各种高级功能和效果，包括权限控制、通用 UI 组件、自定义钩子、布局系统、插件扩展和请求处理等功能。这些包为应用提供了丰富的交互体验和业务功能。

## 子包结构

### access - 权限控制

提供基于角色的权限控制系统，支持权限码验证和权限指令。

### common-ui - 通用 UI 组件

提供应用级别的通用 UI 组件，如页面容器、加载器等。

### hooks - 自定义钩子

提供各种自定义 Vue 组合式钩子，封装常用的业务逻辑。

### layouts - 布局系统

提供应用的各种布局方案，包括侧边栏、顶部导航等布局组件。

### plugins - 插件扩展

提供各种插件和扩展功能，如动画、水印等效果。

### request - 请求处理

提供统一的 HTTP 请求处理方案，包括请求拦截、响应处理等功能。

## 入口与启动

每个子包都有独立的入口文件，主要通过 `src/index.ts` 导出模块的公共 API。

## 关键依赖与配置

### 依赖关系

- 依赖 @core 系列包作为基础
- 使用 @vueuse/core 提供组合式功能
- 集成 ant-design-vue 和 naive-ui 等 UI 框架

### 配置文件

- 各子包都有独立的 `package.json`
- 支持 TypeScript 类型定义
- 配置了 sideEffects 以支持样式导入

## 测试与质量

### 测试策略

- 使用 Vitest 进行单元测试
- 测试文件位于 `__tests__` 目录
- 重点测试权限控制、请求处理等核心功能

### 代码质量

- 严格的 TypeScript 类型检查
- ESLint 和 Prettier 代码规范
- 完整的 JSDoc 注释和示例

## 常见问题 (FAQ)

### 如何使用权限控制？

通过 access 包提供的权限指令和 API 进行权限验证。

### 如何自定义布局？

基于 layouts 包提供的布局组件进行扩展和自定义。

### 如何处理请求？

使用 request 包提供的 `requestClient` 发送 HTTP 请求，支持拦截器和错误处理。

### 如何添加自定义钩子？

在 hooks 包中添加新的组合式函数，遵循 Vue 3 组合式 API 规范。

## 相关文件清单

- `access/` - 权限控制
- `common-ui/` - 通用 UI 组件
- `hooks/` - 自定义钩子
- `layouts/` - 布局系统
- `plugins/` - 插件扩展
- `request/` - 请求处理

## 变更记录 (Changelog)

- 2025-10-15: 初始化效果包文档

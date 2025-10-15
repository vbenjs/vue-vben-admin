# CLAUDE.md - @core 核心包文档

[根目录](../../../CLAUDE.md) > [packages](../../) > **@core**

## 模块职责

@core 是 FactoryOS 的核心功能包集合，提供了整个系统的基础能力，包括设计系统、共享工具、类型定义、组合式函数、偏好设置和 UI 组件库等。这些包构成了整个应用的基础架构。

## 子包结构

### base - 基础功能

- **design**: 设计系统和基础样式
- **icons**: 图标组件库
- **shared**: 共享工具和函数
- **typings**: TypeScript 类型定义

### composables - 组合式函数

提供 Vue 3 的组合式函数，封装常用的业务逻辑和状态管理。

### preferences - 偏好设置

管理应用的用户偏好设置，包括主题、布局、语言等配置。

### ui-kit - UI 组件库

提供基础的 UI 组件，包括表单、布局、菜单、弹窗等组件。

## 入口与启动

每个子包都有独立的入口文件和导出，主要通过 `src/index.ts` 导出模块的公共 API。

## 关键依赖与配置

### 依赖关系

- 所有子包都依赖 `@vueuse/core` 和 `vue`
- base 包是其他子包的基础依赖
- ui-kit 各组件包之间存在相互依赖

### 配置文件

- 各子包都有独立的 `package.json`
- 使用 TypeScript 进行类型定义
- 支持按需导入和 tree-shaking

## 测试与质量

### 测试策略

- 使用 Vitest 进行单元测试
- 测试文件位于 `__tests__` 目录
- 覆盖核心功能和边界情况

### 代码质量

- 严格的 TypeScript 类型检查
- ESLint 和 Prettier 代码规范
- 完整的 JSDoc 注释

## 常见问题 (FAQ)

### 如何使用 @core 包？

在应用中通过 `import { xxx } from '@vben-core/xxx'` 导入所需功能。

### 如何扩展 UI 组件？

基于 ui-kit 中的组件进行扩展，或者创建新的组件包。

### 如何自定义偏好设置？

通过 preferences 包提供的 API 进行配置，支持运行时修改。

## 相关文件清单

- `base/` - 基础功能包
- `composables/` - 组合式函数
- `preferences/` - 偏好设置
- `ui-kit/` - UI 组件库

## 变更记录 (Changelog)

- 2025-10-15: 初始化核心包文档

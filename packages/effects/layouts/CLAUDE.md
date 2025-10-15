# CLAUDE.md - Layouts 布局系统文档

[根目录](../../../../CLAUDE.md) > [packages](../../../) > [effects](../../) > **layouts**

## 模块职责

Layouts 包提供了应用的各种布局方案，包括侧边栏、顶部导航、内容区域等布局组件。它支持多种布局模式，可以根据不同的业务需求进行定制。

## 入口与启动

- **入口文件**: `src/index.ts`
- **布局组件**: `src/components/`
- **布局工具**: `src/utils/`

## 主要功能

### 布局模式
- **侧边栏布局**: 经典的侧边栏 + 顶部导航布局
- **顶部布局**: 纯顶部导航布局
- **混合布局**: 侧边栏 + 顶部导航混合布局
- **移动端布局**: 适配移动端的响应式布局

### 布局组件
- **BasicLayout**: 基础布局组件
- **Sidebar**: 侧边栏组件
- **Header**: 顶部导航组件
- **Content**: 内容区域组件
- **TabBar**: 标签栏组件

### 布局配置
- 支持动态布局切换
- 支持布局主题自定义
- 支持布局行为配置

## 关键依赖与配置

### 依赖关系
- 依赖 `@vben-core/ui-kit` 获取基础 UI 组件
- 依赖 `@vben/stores` 进行状态管理
- 依赖 `@vben/preferences` 获取偏好设置
- 使用 Vue 3 的组件系统

### 配置文件
- `package.json` - 包配置
- 支持 TypeScript 类型定义
- 配置了 sideEffects 以支持样式导入

## 使用示例

### 基础布局使用
```vue
<template>
  <BasicLayout :layout="layoutMode">
    <template #sidebar>
      <Sidebar :collapsed="collapsed" />
    </template>
    <template #header>
      <Header />
    </template>
    <template #content>
      <Content />
    </template>
  </BasicLayout>
</template>
```

### 动态布局切换
```typescript
import { useLayout } from '@vben/layouts';

const { layoutMode, setLayoutMode } = useLayout();

// 切换布局
setLayoutMode('sidebar');
```

## 测试与质量

### 测试策略
- 使用 Vitest 进行单元测试
- 测试文件位于 `__tests__` 目录
- 重点测试布局组件的渲染和交互

### 代码质量
- 严格的 TypeScript 类型检查
- ESLint 和 Prettier 代码规范
- 完整的 JSDoc 注释和示例

## 常见问题 (FAQ)

### 如何自定义布局？
基于现有布局组件进行扩展，或者创建新的布局组件。

### 如何处理响应式布局？
使用内置的响应式断点系统，自动适配不同屏幕尺寸。

### 如何优化布局性能？
使用虚拟滚动和懒加载技术，优化大量数据的渲染性能。

### 如何实现布局主题切换？
通过 CSS 变量和主题系统，实现布局主题的动态切换。

## 相关文件清单

- `src/index.ts` - 主入口
- `src/components/` - 布局组件
- `src/utils/` - 布局工具
- `src/types.ts` - 类型定义

## 变更记录 (Changelog)

- 2025-10-15: 初始化布局系统文档
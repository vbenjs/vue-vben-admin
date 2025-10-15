# CLAUDE.md - Access 权限控制文档

[根目录](../../../../CLAUDE.md) > [packages](../../../) > [effects](../../) > **access**

## 模块职责

Access 包提供了基于角色的权限控制系统，支持权限码验证、权限指令和权限管理功能。它是整个应用安全体系的核心组件。

## 入口与启动

- **入口文件**: `src/index.ts`
- **权限指令**: `src/directives/access.ts`
- **权限工具**: `src/utils/access.ts`

## 主要功能

### 权限验证
- 支持基于权限码的访问控制
- 提供权限验证工具函数
- 支持角色和权限的多种验证方式

### 权限指令
- **v-access**: 元素级权限控制指令
- 支持单个权限码和权限码数组
- 支持角色验证

### 权限管理
- 权限码获取和管理
- 用户权限状态管理
- 权限变更监听

## 关键依赖与配置

### 依赖关系
- 依赖 `@vben/stores` 进行状态管理
- 依赖 `@vben/types` 获取类型定义
- 使用 Vue 3 的指令系统

### 配置文件
- `package.json` - 包配置
- 支持 TypeScript 类型定义
- 配置了 sideEffects 以支持样式导入

## 使用示例

### 权限指令使用
```vue
<template>
  <!-- 单个权限码验证 -->
  <button v-access="'user:create'">创建用户</button>

  <!-- 多个权限码验证（任一匹配） -->
  <button v-access="['user:create', 'user:update']">用户操作</button>

  <!-- 角色验证 -->
  <div v-access="{ role: 'admin'">管理员区域</div>
</template>
```

### 权限工具使用
```typescript
import { hasAccess, hasRole } from '@vben/access';

// 权限码验证
if (hasAccess('user:create')) {
  // 有权限
}

// 角色验证
if (hasRole('admin')) {
  // 是管理员
}
```

## 测试与质量

### 测试策略
- 使用 Vitest 进行单元测试
- 测试文件位于 `__tests__` 目录
- 重点测试权限验证逻辑和指令功能

### 代码质量
- 严格的 TypeScript 类型检查
- ESLint 和 Prettier 代码规范
- 完整的 JSDoc 注释和示例

## 常见问题 (FAQ)

### 如何添加新的权限类型？
在权限工具函数中添加新的验证逻辑，支持更多权限验证方式。

### 如何处理权限变更？
通过监听权限状态变化，动态更新页面权限。

### 如何优化权限验证性能？
使用权限缓存机制，避免重复验证。

## 相关文件清单

- `src/index.ts` - 主入口
- `src/directives/access.ts` - 权限指令
- `src/utils/access.ts` - 权限工具
- `src/types.ts` - 类型定义

## 变更记录 (Changelog)

- 2025-10-15: 初始化权限控制文档
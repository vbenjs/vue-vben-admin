# Project Structure

## Directory Organization

```
FactoryOS/
├── apps/                           # 应用程序层
│   ├── backend-mock/               # Nitro Mock 后端服务
│   │   ├── api/                    # Mock API 路由
│   │   │   ├── auth/               # 认证相关 API
│   │   │   ├── demo/               # 演示数据 API
│   │   │   └── system/             # 系统管理 API
│   │   ├── nitro.config.ts         # Nitro 配置
│   │   └── package.json
│   └── web-antd/                   # 主应用程序 (Ant Design Vue)
│       ├── public/                 # 静态资源
│       ├── src/                    # 源代码
│       │   ├── adapter/            # 适配器层
│       │   │   ├── component/      # 组件适配器
│       │   │   ├── form.ts         # 表单适配器
│       │   │   └── vxe-table.ts    # 表格适配器
│       │   ├── api/                # API 接口层
│       │   │   ├── core/           # 核心业务 API
│       │   │   │   ├── auth.ts     # 认证 API
│       │   │   │   ├── menu.ts     # 菜单 API
│       │   │   │   └── user.ts     # 用户 API
│       │   │   ├── index.ts        # API 入口
│       │   │   └── request.ts      # 请求配置
│       │   ├── views/              # 页面视图层
│       │   ├── router/             # 路由配置
│       │   ├── store/              # 状态管理
│       │   ├── composables/        # 组合式函数
│       │   ├── utils/              # 工具函数
│       │   ├── styles/             # 样式文件
│       │   ├── types/              # 类型定义
│       │   ├── app.vue             # 根组件
│       │   ├── main.ts             # 应用入口
│       │   └── preferences.ts      # 应用配置
│       ├── vite.config.ts          # Vite 配置
│       ├── tsconfig.json           # TypeScript 配置
│       └── package.json
│
├── packages/                       # 共享包层
│   ├── @core/                      # 核心功能包
│   │   ├── base/                   # 基础功能
│   │   │   ├── design/             # 设计系统
│   │   │   ├── icons/              # 图标库
│   │   │   ├── shared/             # 共享工具
│   │   │   └── typings/            # 类型定义
│   │   ├── composables/            # Vue 组合式函数
│   │   │   ├── use-app-config.ts   # 应用配置
│   │   │   ├── use-pagination.ts   # 分页逻辑
│   │   │   └── use-table.ts        # 表格逻辑
│   │   ├── preferences/            # 偏好设置
│   │   │   ├── config.ts           # 配置管理
│   │   │   └── types.ts            # 类型定义
│   │   └── ui-kit/                 # UI 组件库
│   │       ├── form-ui/            # 表单组件
│   │       ├── layout-ui/          # 布局组件
│   │       ├── menu-ui/            # 菜单组件
│   │       ├── popup-ui/           # 弹窗组件
│   │       ├── shadcn-ui/          # Shadcn 组件
│   │       └── tabs-ui/            # 标签页组件
│   ├── effects/                    # 功能效果包
│   │   ├── access/                 # 权限管理
│   │   │   ├── src/                # 源代码
│   │   │   │   ├── auth.ts         # 认证逻辑
│   │   │   │   ├── guard.ts        # 权限守卫
│   │   │   │   └── store.ts        # 权限状态
│   │   │   └── types.ts            # 类型定义
│   │   ├── common-ui/              # 通用 UI
│   │   ├── hooks/                  # 自定义钩子
│   │   │   ├── src/                # 源代码
│   │   │   │   ├── use-global-state.ts  # 全局状态
│   │   │   │   ├── use-request.ts        # 请求钩子
│   │   │   │   └── use-storage.ts        # 存储钩子
│   │   │   └── types.ts            # 类型定义
│   │   ├── layouts/                # 布局系统
│   │   │   ├── src/                # 源代码
│   │   │   │   ├── basic/          # 基础布局
│   │   │   │   ├── blank/          # 空白布局
│   │   │   │   └── classic/        # 经典布局
│   │   │   └── types.ts            # 类型定义
│   │   ├── plugins/                # 插件系统
│   │   │   ├── src/                # 源代码
│   │   │   │   ├── app-config.ts   # 应用配置插件
│   │   │   │   ├── route-config.ts # 路由配置插件
│   │   │   │   └── store-config.ts # 存储配置插件
│   │   │   └── types.ts            # 类型定义
│   │   └── request/                # 请求系统
│   │       ├── src/                # 源代码
│   │       │   ├── client.ts       # 请求客户端
│   │       │   ├── interceptors.ts # 拦截器
│   │       │   └── types.ts        # 类型定义
│   │       └── types.ts            # 类型定义
│   ├── constants/                  # 常量定义
│   │   ├── src/                    # 源代码
│   │   │   ├── api.ts              # API 常量
│   │   │   ├── business.ts         # 业务常量
│   │   │   └── common.ts           # 通用常量
│   │   └── types.ts                # 类型定义
│   ├── icons/                      # 图标库
│   │   ├── src/                    # 源代码
│   │   │   ├── antd/               # Ant Design 图标
│   │   │   ├── lucide/             # Lucide 图标
│   │   │   └── index.ts            # 图标入口
│   │   └── types.ts                # 类型定义
│   ├── locales/                    # 国际化
│   │   ├── src/                    # 源代码
│   │   │   ├── en/                 # 英文翻译
│   │   │   ├── zh-CN/              # 中文翻译
│   │   │   └── index.ts            # 国际化入口
│   │   └── types.ts                # 类型定义
│   ├── stores/                     # 状态管理
│   │   ├── src/                    # 源代码
│   │   │   ├── auth.ts             # 认证状态
│   │   │   ├── user.ts             # 用户状态
│   │   │   └── index.ts            # 状态入口
│   │   └── types.ts                # 类型定义
│   ├── styles/                     # 样式系统
│   │   ├── src/                    # 源代码
│   │   │   ├── antd/               # Ant Design 样式
│   │   │   ├── global.css          # 全局样式
│   │   │   └── index.ts            # 样式入口
│   │   └── types.ts                # 类型定义
│   ├── types/                      # 类型定义
│   │   ├── src/                    # 源代码
│   │   │   ├── api.ts              # API 类型
│   │   │   ├── business.ts         # 业务类型
│   │   │   ├── common.ts           # 通用类型
│   │   │   └── global.d.ts         # 全局类型
│   │   └── types.ts                # 类型定义
│   └── utils/                      # 工具函数
│       ├── src/                    # 源代码
│       │   ├── date.ts             # 日期工具
│       │   ├── format.ts           # 格式化工具
│       │   ├── storage.ts          # 存储工具
│       │   └── index.ts            # 工具入口
│       └── types.ts                # 类型定义
│
├── internal/                       # 内部工具
│   ├── node-utils/                 # Node.js 工具
│   ├── tailwind-config/            # Tailwind 配置
│   ├── tsconfig/                   # TypeScript 配置
│   └── vite-config/                # Vite 配置
│
├── scripts/                        # 构建脚本
│   ├── build.mjs                   # 构建脚本
│   ├── clean.mjs                   # 清理脚本
│   └── deploy/                     # 部署脚本
│
├── docs/                           # 文档
│   ├── src/                        # 文档源码
│   │   ├── guide/                  # 指导文档
│   │   ├── components/             # 组件文档
│   │   └── en/                     # 英文文档
│   └── .vitepress/                 # VitePress 配置
│
├── playground/                     # 测试环境
│   ├── src/                        # 测试源码
│   └── __tests__/                  # 测试文件
│
├── .spec-workflow/                 # 规范工作流
│   ├── templates/                  # 模板文件
│   ├── steering/                   # 指导文档
│   └── specs/                      # 规范文档
│
├── package.json                    # 根包配置
├── pnpm-workspace.yaml             # pnpm 工作空间配置
├── turbo.json                      # Turbo 配置
├── tsconfig.json                   # 根 TypeScript 配置
└── README.md                       # 项目说明
```

## Naming Conventions

### Files

- **组件文件**: `PascalCase.vue` (例: `UserProfile.vue`, `DataTable.vue`)
- **服务文件**: `kebab-case.ts` (例: `user-service.ts`, `auth-service.ts`)
- **工具函数**: `kebab-case.ts` (例: `date-utils.ts`, `format-utils.ts`)
- **类型定义**: `kebab-case.ts` (例: `user-types.ts`, `api-types.ts`)
- **测试文件**: `[filename].test.ts` (例: `user-service.test.ts`, `UserProfile.test.ts`)

### 代码

- **类/接口**: `PascalCase` (例: `UserService`, `UserProfile`)
- **函数/方法**: `camelCase` (例: `getUserProfile`, `formatDate`)
- **常量**: `UPPER_SNAKE_CASE` (例: `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **变量**: `camelCase` (例: `userName`, `isLoading`)
- **组件名**: `PascalCase` (例: `UserProfile`, `DataTable`)

### 目录

- **特性模块**: `kebab-case` (例: `user-management/`, `inventory-system/`)
- **功能模块**: `kebab-case` (例: `auth/`, `api/`, `components/`)
- **测试目录**: `__tests__/` 或 `test/`

## Import Patterns

### Import Order

1. **外部依赖** (第三方库)
2. **内部包** (@core, @vben 等内部包)
3. **相对导入** (同级和下级模块)
4. **类型导入** (type imports)
5. **样式导入** (CSS, SCSS)

```typescript
// 1. 外部依赖
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { z } from 'zod';

// 2. 内部包
import { useAppConfig } from '@vben/hooks';
import { Button } from '@vben/ui-kit';

// 3. 相对导入
import { getUserList } from './api';
import { UserCard } from './components';

// 4. 类型导入
import type { User } from './types';

// 5. 样式导入
import './styles/UserProfile.css';
```

### 模块组织

- **绝对导入**: 使用 `@/` 别名从项目根目录导入
- **包导入**: 使用 `@vben/` 命名空间导入内部包
- **类型导入**: 使用 `type` 关键字进行类型导入
- **动态导入**: 使用 `import()` 进行懒加载

## Code Structure Patterns

### 模块组织

```typescript
// 1. 外部依赖导入
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 2. 内部依赖导入
import { useAppConfig } from '@vben/hooks';
import { Button, Card } from '@vben/ui-kit';

// 3. 类型导入
import type { User, UserFilters } from './types';

// 4. 常量和配置
const API_ENDPOINTS = {
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
};

const DEFAULT_PAGE_SIZE = 20;

// 5. 组件定义
export default defineComponent({
  name: 'UserManagement',
  // ...
});
```

### Vue 组件结构

```vue
<script setup lang="ts">
// 1. 导入声明
import { ref, computed, onMounted } from 'vue';

// 2. Props 和 Emits 定义
interface Props {
  userId: string;
  readonly?: boolean;
}

interface Emits {
  update: [user: User];
  delete: [userId: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 3. 响应式状态
const user = ref<User | null>(null);
const loading = ref(false);

// 4. 计算属性
const fullName = computed(() => {
  if (!user.value) return '';
  return `${user.value.firstName} ${user.value.lastName}`;
});

// 5. 方法
const loadUser = async () => {
  loading.value = true;
  try {
    // 加载用户数据
  } finally {
    loading.value = false;
  }
};

// 6. 生命周期
onMounted(() => {
  loadUser();
});
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

### 函数/方法组织

```typescript
export const getUserProfile = async (userId: string): Promise<User> => {
  // 1. 输入验证
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  // 2. 核心逻辑
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // 3. 错误处理
    console.error('Failed to load user profile:', error);
    throw new Error('Unable to load user profile');
  }
};
```

## Code Organization Principles

1. **单一职责原则**: 每个文件/组件只负责一个明确的功能
2. **模块化设计**: 功能相关的代码组织在一起，便于维护和复用
3. **可测试性**: 代码结构便于编写单元测试和集成测试
4. **一致性**: 遵循项目已建立的编码规范和模式
5. **可读性**: 代码结构清晰，便于其他开发者理解和维护

## Module Boundaries

### 核心架构边界

- **@core 层**: 提供基础功能和设计系统，不依赖业务逻辑
- **effects 层**: 业务功能和插件，依赖 @core 层
- **apps 层**: 应用程序，依赖 core 和 effects 层

### 功能模块边界

- **UI 组件**: 纯展示组件，不包含业务逻辑
- **业务逻辑**: 数据处理和状态管理，不依赖 UI 组件
- **数据访问**: API 调用和数据转换，独立于业务逻辑

### 平台边界

- **浏览器特定**: DOM 操作和浏览器 API
- **通用逻辑**: 纯函数和工具类，可跨平台使用
- **类型定义**: TypeScript 接口和类型，平台无关

## Code Size Guidelines

### 文件大小

- **组件文件**: 建议 < 300 行
- **工具函数文件**: 建议 < 200 行
- **类型定义文件**: 建议 < 500 行
- **测试文件**: 建议 < 400 行

### 函数/方法大小

- **简单函数**: 建议 < 20 行
- **复杂函数**: 建议 < 50 行
- **组件方法**: 建议 < 30 行
- **异步函数**: 建议 < 40 行

### 复杂度限制

- **圈复杂度**: 建议不超过 10
- **嵌套深度**: 建议不超过 4 层
- **参数数量**: 建议不超过 5 个参数
- **返回类型**: 必须明确指定返回类型

## Dashboard/Monitoring Structure

### 管理后台结构

```
src/views/dashboard/
├── analytics/              # 数据分析仪表板
│   ├── Overview.vue       # 概览页面
│   ├── RealTimeChart.vue  # 实时图表
│   └── AnalyticsStore.ts  # 分析数据存储
├── production/             # 生产监控
│   ├── ProductionLine.vue # 生产线监控
│   ├── EquipmentStatus.vue # 设备状态
│   └── QualityMetrics.vue # 质量指标
└── system/                 # 系统管理
    ├── UserManagement.vue # 用户管理
    ├── RoleManagement.vue # 角色管理
    └── SystemConfig.vue   # 系统配置
```

### 监控组件分离

- **数据采集**: 独立的数据收集模块
- **可视化**: 图表和仪表板组件
- **告警系统**: 异常检测和通知
- **报表生成**: 定期报告和导出

## Documentation Standards

### API 文档

- 所有公共 API 必须有完整的 JSDoc 注释
- 包含参数说明、返回值、异常处理
- 提供使用示例和注意事项

### 组件文档

- 组件用途和功能描述
- Props 和 Events 详细说明
- 使用示例和最佳实践
- 可访问性和性能说明

### 复杂逻辑文档

- 业务逻辑的详细说明
- 算法实现和优化思路
- 性能考虑和限制
- 未来改进计划

### README 文件

- 每个主要模块必须有 README.md
- 说明模块用途、依赖关系、使用方法
- 提供快速开始指南和示例代码
- 包含贡献指南和问题反馈方式

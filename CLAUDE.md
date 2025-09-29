# Vue Vben Admin 5.5.9 - ElementUI 技术栈

## 项目概述

这是一个基于 Vben Admin 框架的 Vue 3 + TypeScript 企业级后台管理模板，使用 ElementUI 作为主要的 UI 组件库。项目采用 monorepo 架构，专注于 `web-ele` 应用。

## 技术栈

- **前端框架**: Vue 3 + TypeScript + Vite
- **UI 组件库**: Element Plus v2.10.2
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **CSS 框架**: TailwindCSS
- **表单验证**: Zod
- **HTTP 客户端**: 自定义请求客户端和拦截器
- **图标**: 多种图标库集成
- **身份认证**: 基于 JWT 的 refresh token 机制
- **国际化**: Vue I18n
- **开发工具**: Vite + 热模块替换

### 核心依赖版本

- **Element Plus**: ^2.11.0 (配置在 pnpm-workspace.yaml catalog 中)
- **Vue**: ^3.5.17
- **TypeScript**: ^5.8.3
- **Vite**: ^6.3.5
- **Pinia**: ^3.0.3
- **Vue Router**: ^4.5.1

## 项目结构

### 主应用 (`apps/web-ele/`)

```
apps/web-ele/
├── src/
│   ├── adapter/           # 不同 UI 框架的组件适配器
│   ├── api/              # API 层，包含类型接口
│   │   ├── core/         # 核心 API (认证、用户、菜单)
│   │   └── request.ts    # HTTP 客户端配置
│   ├── layouts/          # 布局组件
│   │   ├── auth.vue      # 认证页面布局
│   │   └── basic.vue     # 主应用布局
│   ├── locales/          # 国际化语言文件
│   ├── router/           # 路由配置
│   │   ├── guard.ts      # 认证路由守卫
│   │   └── routes/       # 路由定义
│   ├── store/            # Pinia 状态管理
│   │   └── auth.ts       # 认证状态
│   ├── views/            # 页面组件
│   │   ├── _core/        # 核心页面 (认证、错误页)
│   │   │   └── authentication/  # 登录、注册等
│   │   └── dashboard/    # 仪表板页面
│   ├── app.vue           # 根组件
│   ├── main.ts           # 应用入口
│   └── preferences.ts    # 应用偏好设置
└── package.json
```

### Mock 后端 (`apps/backend-mock/`)

- 提供开发环境 API 端点
- JWT 令牌生成和验证
- 用户认证模拟
- 位置: `apps/backend-mock/api/`

## 认证系统

### 登录流程

1. 用户通过 `login.vue` 提交凭据
2. `authStore.authLogin()` 处理登录过程
3. API 调用 `/auth/auth/login` 端点
4. 成功时: 存储 accessToken，获取用户信息，设置权限
5. 重定向到用户主页或默认仪表板

### 核心文件

- **登录组件**: `src/views/_core/authentication/login.vue`
- **认证状态**: `src/store/auth.ts`
- **认证 API**: `src/api/core/auth.ts`
- **路由守卫**: `src/router/guard.ts`
- **认证布局**: `src/layouts/auth.vue`

### 可用测试账户

- **超级管理员**: 用户名: `vben`, 密码: `123456`
- **管理员**: 用户名: `admin`, 密码: `123456`
- **普通用户**: 用户名: `jack`, 密码: `123456`

## 开发命令

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 启动指定应用
pnpm --filter @vben/web-ele dev
```

### 构建

```bash
# 生产构建
pnpm build

# 构建指定应用
pnpm --filter @vben/web-ele build
```

### 代码检查和类型检查

```bash
# 运行 ESLint
pnpm lint

# 修复代码格式问题
pnpm lint:fix

# 类型检查
pnpm type-check
```

### 测试

```bash
# 运行测试
pnpm test

# 运行端到端测试
pnpm test:e2e
```

## 核心功能

### 权限系统

- **路由级别**: 通过路由守卫控制
- **菜单级别**: 基于用户角色动态生成菜单
- **按钮级别**: 使用权限码进行细粒度权限控制
- **权限码**: 通过 `getAccessCodesApi()` 获取

### 布局系统

- **AuthPageLayout**: 用于认证页面
- **BasicLayout**: 用于主应用页面
- 可自定义工具栏、侧边栏和内容区域

### 表单系统

- **VbenForm**: 增强的表单组件，带验证
- **基于模式**: 使用模式对象定义表单
- **Zod 集成**: 类型安全验证
- **动态字段**: 条件字段渲染

### 组件适配

- **Element Plus**: 主要 UI 库
- **自定义适配器**: 位于 `src/adapter/`
- **表单适配器**: `src/adapter/form.ts`
- **表格适配器**: `src/adapter/vxe-table.ts`

## 配置

### 偏好设置

- 文件: `src/preferences.ts`
- 控制应用行为、主题、布局等
- 可按环境自定义

### 环境变量

- 开发环境: 使用不同端口的 mock 后端
- 生产环境: 相应配置 API 端点

### 路由

- **核心路由**: 认证、错误页面
- **功能路由**: 仪表板、演示等
- **访问控制**: 基于角色的路由过滤

## API 集成

### 请求客户端

- 带拦截器的基础客户端
- 自动注入令牌
- 错误处理和重试逻辑
- 位置: `src/api/request.ts`

### API 结构

```typescript
// API 函数示例
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/auth/login', data);
}
```

## 状态管理

### 认证状态 (`src/store/auth.ts`)

- `authLogin()`: 处理用户登录
- `logout()`: 清除会话并重定向
- `fetchUserInfo()`: 获取用户详情
- `loginLoading`: 登录加载状态管理

### 状态集成

- 使用 Pinia 进行状态管理
- 与 Vue DevTools 集成
- 用户会话的持久化状态

## 样式

### TailwindCSS

- 主要样式框架
- 自定义配置在 `tailwind.config.mjs`
- 组件特定工具类

### Element Plus

- 组件库样式
- 可进行主题自定义
- Element Plus 图标库

## 开发指南

### 代码风格

- 遵循 ESLint 配置
- 严格使用 TypeScript
- 优先使用组合式 API
- 使用 Pinia 进行状态管理

### 文件命名

- 文件和目录使用 kebab-case
- 组件名使用 PascalCase
- 函数和变量使用 camelCase

### 表单验证规范

使用项目内置的 Zod 进行表单验证，统一使用以下模式：

```typescript
import { z } from '#/adapter/form';

// 必填字符串
{
  rules: z.string().min(1, { message: '请输入字符串' });
}

// 长度限制
{
  rules: z.string()
    .min(2, { message: '至少2个字符' })
    .max(64, { message: '最多64个字符' });
}

// 可选字段(可以是undefined)
{
  rules: z.string().optional();
}

// 邮箱验证（允许空值）
{
  rules: z.string().email().or(z.literal('')).optional();
}

// 复杂校验
{
  rules: z.string()
    .min(1, { message: '请输入' })
    .refine((value) => value === '123', {
      message: '值必须为123',
    });
}
```

### 时间格式化规范

使用项目内置的 `dayjs` 进行时间格式化，统一使用以下格式：

#### 标准时间格式

```javascript
import dayjs from 'dayjs';

// 格式化时间函数
function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// 使用示例 - 表格列时间格式化
<ElTableColumn label="创建时间" prop="createdTime" width="160" align="center">
  <template #default="{ row }">
    {{ formatDateTime(row.createdTime) }}
  </template>
</ElTableColumn>
```

#### 支持的时间格式

- **完整时间**: `YYYY-MM-DD HH:mm:ss` (如: 2022-07-28 13:00:00)
- **日期**: `YYYY-MM-DD` (如: 2022-07-28)
- **时间**: `HH:mm:ss` (如: 13:00:00)
- **相对时间**: 使用 dayjs 的相对时间插件

#### 最佳实践

- 所有时间显示必须使用 dayjs 格式化
- 统一使用 `formatDateTime` 函数处理时间显示
- 空值安全：时间为空时返回空字符串
- 表格中时间列统一右对齐 (`align="center"`)

### 图标使用规范

项目使用 Iconify 作为主要图标系统，支持多种图标库的统一管理。

#### 基本使用方式

```vue
<script lang="ts" setup>
import { IconifyIcon } from '@vben/icons';
</script>

<template>
  <!-- 基本图标使用 -->
  <IconifyIcon icon="lucide:home" class="h-5 w-5" />

  <!-- 搜索图标 -->
  <IconifyIcon icon="lucide:search" class="h-4 w-4" />

  <!-- 用户图标 -->
  <IconifyIcon icon="lucide:user" class="h-5 w-5" />
</template>
```

#### Element Plus 输入框中使用图标

```vue
<template>
  <!-- 搜索输入框 -->
  <ElInput v-model="searchKeyword" placeholder="请输入搜索关键词" clearable>
    <template #prefix>
      <IconifyIcon icon="lucide:search" class="text-muted-foreground h-4 w-4" />
    </template>
  </ElInput>

  <!-- 用户名输入框 -->
  <ElInput v-model="username" placeholder="请输入用户名">
    <template #prefix>
      <IconifyIcon icon="lucide:user" class="text-muted-foreground h-4 w-4" />
    </template>
  </ElInput>

  <!-- 密码输入框 -->
  <ElInput
    v-model="password"
    type="password"
    placeholder="请输入密码"
    show-password
  >
    <template #prefix>
      <IconifyIcon icon="lucide:lock" class="text-muted-foreground h-4 w-4" />
    </template>
  </ElInput>
</template>
```

#### 主题适配颜色类规范

**必须使用语义化颜色类确保主题自动切换：**

```vue
<template>
  <!-- ✅ 正确：使用语义化颜色 -->
  <IconifyIcon icon="lucide:search" class="text-muted-foreground h-4 w-4" />
  <IconifyIcon icon="lucide:user" class="text-foreground h-5 w-5" />
  <IconifyIcon icon="lucide:settings" class="text-primary h-4 w-4" />

  <!-- ❌ 错误：固定颜色不会随主题变化 -->
  <IconifyIcon icon="lucide:search" class="h-4 w-4 text-gray-400" />
  <IconifyIcon icon="lucide:user" class="h-5 w-5 text-blue-500" />
</template>
```

#### 推荐的颜色类

- `text-foreground` - 主要文本颜色，用于重要图标
- `text-muted-foreground` - 次要文本颜色，用于装饰性图标（如输入框前缀图标）
- `text-primary` - 主题色，用于激活状态或强调图标
- `text-accent-foreground` - 强调色，用于特殊状态图标
- `text-destructive` - 危险操作图标（删除、警告等）

#### 图标尺寸规范

- `h-3 w-3` - 小图标（12px）
- `h-4 w-4` - 常规图标（16px）- **输入框推荐**
- `h-5 w-5` - 中等图标（20px）- **按钮推荐**
- `h-6 w-6` - 大图标（24px）
- `h-8 w-8` - 超大图标（32px）

#### 常用图标名称

- `lucide:search` - 搜索
- `lucide:user` - 用户
- `lucide:lock` - 锁定/密码
- `lucide:mail` - 邮件
- `lucide:eye` - 显示
- `lucide:eye-off` - 隐藏
- `lucide:settings` - 设置
- `lucide:edit` - 编辑
- `lucide:trash` - 删除
- `lucide:plus` - 添加
- `lucide:download` - 下载
- `lucide:upload` - 上传

## 主题色开发规范

项目采用基于 CSS 变量的主题系统，支持动态主题切换和深色模式。开发时必须使用主题变量而非硬编码颜色，确保界面能够正确适配用户选择的主题。

### 主题系统架构

#### CSS 变量定义

- **默认主题**: `packages/@core/base/design/src/design-tokens/default.css`
- **深色主题**: `packages/@core/base/design/src/design-tokens/dark.css`
- **TailwindCSS 配置**: `internal/tailwind-config/src/index.ts`

#### 支持的主题

- **内置主题**: 15种预设主题（default, violet, pink, yellow, sky-blue, green 等）
- **自定义主题**: 支持用户自定义主色调
- **明暗模式**: 自动适配系统偏好或手动切换

### 核心CSS变量

#### 基础颜色变量

```css
/* 主题色系 */
--primary: 212 100% 45%; /* 主题色 */
--primary-foreground: 0 0% 98%; /* 主题色前景 */

/* 背景色系 */
--background: 0 0% 100%; /* 主背景色 */
--background-deep: 216 20.11% 95.47%; /* 深层背景色 */
--card: 0 0% 100%; /* 卡片背景色 */
--card-foreground: 222.2 84% 4.9%; /* 卡片前景色 */

/* 边框和输入 */
--border: 240 5.9% 90%; /* 边框色 */
--input: 240deg 5.88% 90%; /* 输入框边框色 */

/* 强调色系 */
--accent: 240 5% 96%; /* 强调背景色 */
--accent-hover: 200deg 10% 90%; /* 悬浮强调色 */
--muted: 240 4.8% 95.9%; /* 柔和背景色 */
--muted-foreground: 240 3.8% 46.1%; /* 柔和前景色 */

/* 功能色系 */
--destructive: 359.33 100% 65.1%; /* 危险色 */
--success: 144 57% 58%; /* 成功色 */
--warning: 42 84% 61%; /* 警告色 */
```

#### 主题色阶系统

项目使用 `createColorsPalette` 函数为每种颜色生成完整色阶：

```css
/* 主题色阶（50-700） */
--primary-50: /* 最浅背景色 */ --primary-100: /* 较浅背景色 */
  --primary-200: /* 浅背景色 */ --primary-300: /* 浅边框色 */
  --primary-400: /* 常规边框色 */ --primary-500: /* 主色调 */
  --primary-600: /* 悬浮色 */ --primary-700: /* 激活色 */ /* 语义化别名 */
  --primary-background-lightest: var(--primary-50);
--primary-background-lighter: var(--primary-100);
--primary-background-light: var(--primary-200);
--primary-border-light: var(--primary-300);
--primary-border: var(--primary-400);
--primary-text: var(--primary-500);
--primary-text-hover: var(--primary-600);
--primary-text-active: var(--primary-700);
```

### 开发实践规范

#### ✅ 正确使用主题变量

**1. 在 Vue 组件样式中使用**

```vue
<style scoped>
/* ✅ 使用主题变量 */
.item-active {
  color: hsl(var(--primary-text));
  background-color: hsl(var(--primary-background-lightest));
  border-color: hsl(var(--primary-border));
  box-shadow: 0 0 0 1px hsl(var(--primary) / 10%);
}

.item-hover {
  background-color: hsl(var(--accent-hover));
  border-color: hsl(var(--border));
}

.card-container {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
}
</style>
```

**2. 在内联样式中使用**

```vue
<template>
  <!-- ✅ 内联样式使用主题变量 -->
  <div style="color: hsl(var(--primary-text))">
    {{ content }}
  </div>

  <span
    style="background-color: hsl(var(--success)); color: hsl(var(--success-foreground))"
  >
    成功状态
  </span>
</template>
```

**3. TailwindCSS 类名使用**

```vue
<template>
  <!-- ✅ 使用语义化TailwindCSS类 -->
  <div class="bg-card text-card-foreground border-border border">
    <button class="bg-primary text-primary-foreground hover:bg-primary-hover">
      主要按钮
    </button>

    <span class="text-muted-foreground"> 次要文本 </span>

    <div class="bg-accent hover:bg-accent-hover">强调区域</div>
  </div>
</template>
```

#### ❌ 避免的错误做法

```vue
<style scoped>
/* ❌ 硬编码颜色值 - 不会随主题变化 */
.item-active {
  color: #1e40af;
  background-color: #eff6ff;
  border-color: #3b82f6;
}

/* ❌ 使用固定的TailwindCSS颜色类 */
.status-text {
  @apply bg-blue-50 text-blue-500;
}
</style>

<template>
  <!-- ❌ 固定颜色类名 -->
  <div class="bg-gray-100 text-gray-600">内容</div>

  <!-- ❌ 硬编码内联样式 -->
  <span style="color: #3b82f6"> 状态文本 </span>
</template>
```

### 常见使用场景

#### 列表项状态

```vue
<style scoped>
.list-item {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  transition: all 0.2s;
}

.list-item:hover {
  background-color: hsl(var(--accent-hover));
}

.list-item.active {
  background-color: hsl(var(--primary-background-lightest));
  border-color: hsl(var(--primary-border));
  color: hsl(var(--primary-text));
}
</style>
```

#### 按钮状态

```vue
<style scoped>
.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--primary));
}

.btn-primary:hover {
  background-color: hsl(var(--primary-600));
  border-color: hsl(var(--primary-600));
}

.btn-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}
</style>
```

#### 表单元素

```vue
<style scoped>
.form-input {
  background-color: hsl(var(--input-background));
  border: 1px solid hsl(var(--input));
  color: hsl(var(--foreground));
}

.form-input:focus {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary) / 20%);
}

.form-input::placeholder {
  color: hsl(var(--muted-foreground));
}
</style>
```

### 最佳实践

1. **优先使用语义化变量**: 使用 `--card`、`--primary-text` 而非具体的色值
2. **保持透明度一致**: 使用 `hsl(var(--primary) / 10%)` 格式处理透明度
3. **注意对比度**: 确保文本在各种主题下都有足够的对比度
4. **测试多主题**: 开发完成后切换不同主题进行测试
5. **使用过渡动画**: 为颜色变化添加 `transition` 提升用户体验

### 主题切换测试

开发完成后必须测试以下场景：

- 切换内置主题（蓝色、紫色、绿色等）
- 切换明暗模式
- 自定义主题色测试
- 确保所有交互状态正常显示

## 代码格式化规范

为了保持代码风格一致性和质量，必须严格遵循代码格式化流程。

### 强制执行规则

#### 每次代码修改后必须执行格式化

```bash
# 修改代码后立即执行
pnpm format
```

#### 提交前检查

```bash
# 类型检查
pnpm check:type

# 代码质量检查
pnpm lint

# 完整检查（包含类型检查、依赖检查、拼写检查等）
pnpm check
```

### 开发工作流

#### 标准开发流程

1. **编写代码** - 实现功能逻辑
2. **格式化代码** - 执行 `pnpm format`
3. **类型检查** - 执行 `pnpm check:type`
4. **功能测试** - 验证功能正常
5. **提交代码** - 遵循 Git 提交规范

#### 代码质量工具

**ESLint 配置**

- 使用项目内置 ESLint 配置
- 支持 Vue 3 Composition API
- TypeScript 严格模式检查
- 导入排序和格式化

**Prettier 配置**

- 统一代码风格
- 自动修复格式问题
- 支持 Vue、TypeScript、CSS、JSON

**StyleLint 配置**

- CSS/SCSS 代码规范
- 属性排序规范
- 颜色值格式规范

### 格式化错误解决

#### 常见错误类型

**1. 导入排序错误**

```bash
# 错误提示示例
Replace `import A from 'a';\nimport B from 'b'` with `import B from 'b';\nimport A from 'a'`

# 解决方案
pnpm format  # 自动修复导入排序
```

**2. 代码缩进/换行错误**

```bash
# 错误提示示例
Insert `⏎` (换行)
Replace ` ` with `⏎    ` (缩进)

# 解决方案
pnpm format  # 自动修复格式问题
```

**3. CSS 属性排序错误**

```bash
# 错误提示示例
Expected "margin-bottom" to come before "border-radius"

# 解决方案
pnpm format  # 自动修复CSS属性排序
```

#### 循环修复错误处理

如果遇到循环修复错误：

```bash
# 错误信息示例
ESLintCircularFixesWarning: Circular fixes detected

# 解决步骤
1. 手动检查冲突的规则
2. 暂时禁用冲突规则
3. 逐步修复代码问题
4. 重新启用规则
```

### Git 提交规范

#### 提交前检查清单

- [ ] 代码功能正常运行
- [ ] 执行了 `pnpm format`
- [ ] 执行了 `pnpm check:type` 无错误
- [ ] 遵循项目编码规范
- [ ] 添加了必要的注释
- [ ] 更新了相关文档（如需要）

#### 提交信息格式

```bash
# 格式
type(scope): description

# 示例
feat(permission): 添加权限组主题色适配
fix(api): 修复权限查询参数类型错误
style(ui): 优化权限列表选中状态样式
docs(claude): 更新主题色开发规范
```

### 组件结构

```vue
<script lang="ts" setup>
import dayjs from 'dayjs'; // 导入时间处理库
import { z } from '#/adapter/form'; // 表单验证
import { IconifyIcon } from '@vben/icons'; // 导入图标组件

// 其他导入
// Props/Emits
// 响应式数据
// 计算属性
// 方法 (包含时间格式化函数)
// 生命周期
</script>

<template>
  <!-- 模板内容 -->
</template>
```

## 问题排查

### 常见问题

1. **登录失败**: 检查 mock 后端是否运行
2. **路由无法访问**: 验证用户权限和权限码
3. **构建错误**: 运行类型检查并修复 TypeScript 错误
4. **样式问题**: 检查 TailwindCSS 类和 Element Plus 导入

### 调试工具

- Vue DevTools 用于组件检查
- 网络选项卡用于 API 调试
- 控制台用于错误消息
- Pinia DevTools 用于状态管理

## 常用路径

- **主应用**: `apps/web-ele/`
- **文档**: `docs/`
- **内部工具**: `internal/`
- **Mock 后端**: `apps/backend-mock/`

## CLI 集成

该项目支持 Vben CLI 用于脚手架和开发任务。请参考项目文档了解 CLI 使用方法。

## 代码修改记录

### IconPicker z-index 层级修复 (2025-08-25)

**问题**: 菜单管理中的IconPicker弹框显示在Element Plus Dialog遮罩层下面，无法正常交互。

**根本原因**: VbenPopover的z-index低于Element Plus Dialog的遮罩层z-index。

**解决方案**: 为IconPicker添加`content-props`属性，设置更高的z-index值。

**修改位置**: `apps/web-ele/src/views/system/menu/index.vue:545-552`

**修改内容**:

```vue
<!-- 修改前 -->
<IconPicker
  v-model="formData.icon"
  placeholder="请选择菜单图标"
  prefix="ant-design"
/>

<!-- 修改后 -->
<IconPicker
  v-model="formData.icon"
  placeholder="请选择菜单图标"
  prefix="ant-design"
  :content-props="{
    style: { zIndex: 3000 },
  }"
/>
```

**还原方法**: 删除`:content-props`属性即可还原到原始状态。

**影响范围**: 仅影响菜单管理页面的图标选择器显示层级，不影响其他功能。

## 表单开发规范

项目采用 VbenForm 作为统一的表单解决方案，提供了声明式配置、类型安全验证、动态字段控制等现代化特性。

### VbenForm 基础配置

#### 基本结构

```vue
<script lang="ts" setup>
import { useVbenForm } from '#/adapter/form';

// 定义表单 Schema
const [FormComponent, formApi] = useVbenForm({
  // 所有表单项共用配置
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: handleSave,
  // 布局方式: 'horizontal' | 'vertical'
  layout: 'vertical',
  schema: [
    // 表单字段配置...
  ],
  // 网格布局: 一行显示几个字段
  wrapperClass: 'grid-cols-1',
});

// 提交处理函数
async function handleSave(values: Record<string, any>) {
  try {
    // 处理表单提交逻辑
    await submitData(values);
  } catch (error) {
    // 错误处理
    throw error; // 重新抛出错误，阻止表单关闭
  }
}
</script>

<template>
  <!-- 在对话框中使用表单 -->
  <VbenModal v-model:open="dialogVisible" :title="dialogTitle">
    <FormComponent :disabled="{ fieldName: isEdit }" />
  </VbenModal>
</template>
```

#### 字段类型配置

**基础输入字段**

```javascript
// 文本输入框
{
  component: 'Input',
  componentProps: {
    placeholder: '请输入用户名',
  },
  fieldName: 'username',
  label: '用户名',
  rules: 'required|min:2|max:64',
},

// 数字输入框
{
  component: 'InputNumber',
  componentProps: {
    placeholder: '请输入排序号',
    min: 0,
    max: 9999,
    precision: 0,
    controlsPosition: 'right',
    style: { width: '100%' },
  },
  fieldName: 'sort',
  label: '排序',
  help: '数字越小排序越靠前，留空将使用默认排序',
},
```

**选择类字段**

```javascript
// 下拉选择
{
  component: 'Select',
  componentProps: {
    placeholder: '请选择菜单类型',
    options: [
      { label: '目录', value: '0' },
      { label: '菜单', value: '1' },
      { label: '按钮', value: '2' },
    ],
  },
  fieldName: 'menuType',
  label: '菜单类型',
  rules: 'required',
},

// 图标选择器
{
  component: 'IconPicker',
  componentProps: {
    placeholder: '请选择菜单图标',
    prefix: 'ant-design',
  },
  fieldName: 'icon',
  label: '菜单图标',
},
```

#### 动态字段控制

使用 `dependencies` 实现字段的条件显示：

```javascript
{
  component: 'Input',
  componentProps: {
    placeholder: '请输入路由路径',
  },
  fieldName: 'routerPath',
  label: '路由路径',
  // 只在菜单类型为"菜单"或"按钮"时显示
  dependencies: {
    triggerFields: ['menuType'],
    show: (values) => values.menuType === '1' || values.menuType === '2',
  },
},
```

#### 验证规则

**字符串验证规则**

```javascript
// 简单规则
rules: 'required'; // 必填
rules: 'required|min:2|max:64'; // 必填 + 长度限制
rules: 'selectRequired'; // 下拉选择必填

// 复杂验证 - 使用 Zod
rules: z.string()
  .min(2, '用户名至少2个字符')
  .max(64, '用户名最多64个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线');
```

### TreeSelect 组件使用规范

项目中使用 TreeSelect 组件进行树形数据选择，主要应用于层级结构数据的选择场景。

#### 基本使用方式

**VbenForm 中的 TreeSelect 配置（Element Plus 版本）**

```javascript
{
  component: 'TreeSelect',
  componentProps: () => ({
    placeholder: '请选择上级部门（留空为根级部门）',
    allowClear: true,
    showSearch: true,
    data: departmentTreeData.value,
    nodeKey: 'depCode',
    props: {
      label: 'depName',
    },
  }),
  fieldName: 'parentDepCode',
  label: '上级部门',
  rules: z.string().optional(),
}
```

#### 核心配置说明

**数据源配置**

- `data`: 树形数据源，必须是响应式数据（Element Plus TreeSelect）
- `nodeKey`: 节点唯一标识字段，对应选择的值
- 数据格式要求：包含 `children` 字段的嵌套结构

**字段映射配置**

- `props`: 字段映射对象（Element Plus 方式）
  - `label`: 显示文本字段名（如：'depName'）
- `nodeKey`: 作为选择值的字段（如：'depCode'）

**交互配置**

- `placeholder`: 占位符文本
- `allowClear`: 是否允许清空选择（Element Plus 为 `clearable`）
- `showSearch`: 是否启用搜索功能（Element Plus 为 `filterable`）

#### 响应式数据处理

**方案一：直接使用响应式数据**

```javascript
// 直接在 componentProps 中使用
data: originalData.value,
```

**方案二：通过 setState 更新（推荐用于复杂场景）**

```javascript
// 在数据加载完成后通过 formApi 更新
formApi.setState({
  schema: [
    {
      fieldName: 'parentDepCode',
      componentProps: {
        data: newTreeData,
      },
    },
  ],
});
```

**方案三：computed 包装（最佳实践）**

```javascript
// 创建 computed 属性
const departmentTreeData = computed(() => {
  return originalData.value;
});

// 在 componentProps 中使用
componentProps: () => ({
  data: departmentTreeData.value,
  // 其他配置...
}),
```

#### Element Plus TreeSelect vs Ant Design TreeSelect

**Element Plus 版本（项目当前使用）**

```javascript
{
  component: 'TreeSelect',
  componentProps: () => ({
    placeholder: '请选择部门',
    data: treeData.value,           // 数据源
    nodeKey: 'depCode',             // 值字段
    props: {                        // 字段映射
      label: 'depName',             // 显示字段
    },
    clearable: true,                // 可清空
    filterable: true,               // 可搜索
  }),
}
```

**Ant Design 版本（参考对比）**

```javascript
{
  component: 'TreeSelect',
  componentProps: () => ({
    placeholder: '请选择部门',
    treeData: treeData.value,       // 数据源
    replaceFields: {                // 字段映射
      label: 'depName',
      key: 'depId',
      value: 'depCode',
    },
    allowClear: true,               // 可清空
    showSearch: true,               // 可搜索
    treeNodeFilterProp: 'label',    // 搜索字段
  }),
}
```

#### 数据结构示例

**标准树形数据结构**

```javascript
const treeData = [
  {
    depId: 1,
    depCode: '0000',
    depName: '总公司',
    children: [
      {
        depId: 2,
        depCode: '0001',
        depName: '技术部',
        children: [
          {
            depId: 3,
            depCode: '0002',
            depName: '前端组',
            children: null,
          },
        ],
      },
    ],
  },
];
```

#### 常见问题及解决方案

**问题1：数据更新但TreeSelect不显示**

```javascript
// ❌ 错误：componentProps 使用对象形式
componentProps: {
  data: originalData.value, // 失去响应性
}

// ✅ 正确：componentProps 使用函数形式
componentProps: () => ({
  data: originalData.value, // 保持响应性
})
```

**问题2：选择值不正确**

```javascript
// 确保 nodeKey 字段映射正确
nodeKey: 'depCode', // 选中时返回的是 depCode 字段的值
props: {
  label: 'depName', // 显示的是 depName 字段的内容
}
```

**问题3：搜索功能不工作**

```javascript
// Element Plus TreeSelect 需要设置 filterable
componentProps: () => ({
  filterable: true, // 启用搜索
  data: treeData.value,
});
```

#### 最佳实践

**1. 使用函数形式的 componentProps**

```javascript
// ✅ 推荐：函数形式保持响应性
componentProps: () => ({
  data: treeData.value,
})

// ❌ 不推荐：对象形式可能失去响应性
componentProps: {
  data: treeData.value,
}
```

**2. 合理的字段映射（Element Plus）**

```javascript
// Element Plus TreeSelect 配置
nodeKey: 'code',        // 表单提交的值
props: {
  label: 'displayName', // 用户看到的文本
}
```

**3. 数据加载时机**

```javascript
// 在组件挂载或依赖更新时加载数据
onMounted(async () => {
  await loadTreeData();
});

// 或在表单打开时加载
async function handleAdd() {
  await loadTreeData();
  dialogVisible.value = true;
}
```

**4. 错误处理**

```javascript
async function loadTreeData() {
  try {
    const response = await getTreeDataApi();
    originalData.value = response;
  } catch (error) {
    ElMessage.error('加载数据失败');
    originalData.value = []; // 设置默认值
  }
}
```

#### 实际应用示例

**部门选择器完整配置（Element Plus）**

```javascript
// 创建响应式数据
const departmentTreeData = computed(() => {
  return originalData.value;
});

// 表单配置
{
  component: 'TreeSelect',
  componentProps: () => ({
    placeholder: '请选择上级部门（留空为根级部门）',
    data: departmentTreeData.value,
    nodeKey: 'depCode',
    props: {
      label: 'depName',
    },
    clearable: true,
    filterable: true,
    // 可选：展开配置
    defaultExpandAll: false,
    expandOnClickNode: false,
  }),
  fieldName: 'parentDepCode',
  label: '上级部门',
  rules: z.string().optional(),
  help: '选择部门的上级部门，留空表示根级部门',
}
```

**常见使用场景**

- **部门选择**: 选择上级部门、归属部门
- **分类选择**: 商品分类、文章分类
- **组织架构**: 组织层级选择
- **地区选择**: 省市区三级联动（需配合接口）
- **菜单选择**: 选择父级菜单

### 表单 API 操作

#### 基本操作方法

```javascript
// 设置表单值
formApi.setValues({
  username: 'admin',
  menuType: '1',
  isShow: '0',
});

// 设置单个字段值
formApi.setFieldValue('username', 'newValue');

// 重置表单
formApi.resetForm();

// 获取表单值
const values = formApi.getValues();

// 验证表单
const isValid = await formApi.validate();
```

#### 表单状态管理

```javascript
// 新增模式
function handleAdd() {
  dialogTitle.value = '新增用户';
  isEdit.value = false;
  dialogVisible.value = true;

  // 重置表单并设置默认值
  formApi.resetForm();
  formApi.setValues({
    status: '1',
    role: 'user',
  });
}

// 编辑模式
async function handleEdit(id: number) {
  dialogTitle.value = '编辑用户';
  isEdit.value = true;

  // 获取详情数据并填充表单
  const response = await getUserDetailApi({ id });
  formApi.setValues(response);
  dialogVisible.value = true;
}
```

### 表单最佳实践

#### 1. 字段禁用控制

```vue
<template>
  <!-- 编辑时禁用某些字段 -->
  <FormComponent :disabled="{ userCode: isEdit, email: isEdit }" />
</template>
```

#### 2. 帮助信息

```javascript
{
  fieldName: 'sort',
  label: '排序',
  help: '数字越小排序越靠前，留空将使用默认排序',
}
```

#### 3. 网格布局

```javascript
// 一行显示1个字段 - 适合复杂表单
wrapperClass: 'grid-cols-1';

// 一行显示2个字段 - 适合中等复杂表单
wrapperClass: 'grid-cols-1 md:grid-cols-2';

// 响应式布局 - 小屏1个，中屏2个，大屏3个
wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
```

#### 4. 错误处理

```javascript
async function handleSave(values: Record<string, any>) {
  try {
    if (isEdit.value) {
      await updateApi({ ...values, id: currentId.value });
      ElMessage.success('更新成功');
    } else {
      await createApi(values);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadDataList(); // 刷新列表
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    throw error; // 重新抛出错误，阻止表单关闭
  }
}
```

#### 字段禁用控制

在编辑模式下，通常需要禁用某些关键字段（如编码、唯一标识等）。以下是几种实现方式：

**方案1：使用 computed 响应式禁用（推荐）**

```javascript
// 使用computed确保响应式更新
const disabledFields = computed(() => {
  return isEdit.value ? { paramCode: true } : {};
});
```

```vue
<template>
  <!-- 使用computed确保响应式 -->
  <SystemParamForm :disabled="disabledFields" />
</template>
```

**方案2：在schema中使用dependencies动态控制**

```javascript
{
  component: 'Input',
  componentProps: {
    placeholder: '请输入参数编码',
  },
  fieldName: 'paramCode',
  label: '参数编码',
  rules: z.string()...,
  // 使用dependencies来动态控制disabled状态
  dependencies: {
    triggerFields: ['isEditMode'], // 依赖编辑模式标识字段
    componentProps: (values) => ({
      disabled: values.isEditMode === true,
    }),
  },
}
```

```javascript
// 在编辑时设置编辑模式标识
systemParamFormApi.setValues({
  ...response,
  isEditMode: true, // 设置编辑模式标识
});
```

**方案3：使用componentProps函数形式**

```javascript
{
  component: 'Input',
  componentProps: () => ({
    placeholder: '请输入参数编码',
    disabled: isEdit.value, // 直接引用响应式变量
  }),
  fieldName: 'paramCode',
  label: '参数编码',
  rules: z.string()...,
}
```

**方案4：字符串数组形式的disabled**

```javascript
const disabledFieldNames = computed(() => {
  return isEdit.value ? ['paramCode'] : [];
});
```

```vue
<template>
  <SystemParamForm :disabled="disabledFieldNames" />
</template>
```

**最佳实践建议**

1. **优先使用方案1**（computed对象形式），改动最小且与Vue响应式系统配合最好
2. **复杂场景使用方案2**（dependencies），提供最大的灵活性和明确性
3. **避免方案3**，因为每次渲染都会重新创建componentProps对象
4. **简单场景可使用方案4**，数组形式比较直观

## 表格开发规范

项目采用 VxeTable 作为高性能表格解决方案，支持树形结构、虚拟滚动、插槽自定义等现代化特性。

### VxeTable 基础配置

#### 基本结构

```vue
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

// 表格数据
const tableData = ref<DataType[]>([]);
const loading = ref(false);

// VxeTable 配置
const gridOptions: VxeGridProps<DataType> = {
  columns: [
    // 列配置...
  ],
  data: [],
  loading: false,
  // 其他配置...
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 数据加载
async function loadDataList() {
  loading.value = true;
  gridOptions.loading = true;

  try {
    const response = await getDataApi(params);
    tableData.value = response;
    gridOptions.data = response; // 更新表格数据
  } catch (error) {
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}
</script>

<template>
  <Grid table-title="数据列表" table-title-help="管理系统数据">
    <template #toolbar-tools>
      <ElButton type="primary" @click="handleAdd()">新增</ElButton>
      <ElButton @click="expandAll">展开全部</ElButton>
      <ElButton @click="collapseAll">折叠全部</ElButton>
    </template>

    <!-- 列插槽定义 -->
    <template #columnSlot="{ row }">
      <!-- 自定义列内容 -->
    </template>
  </Grid>
</template>
```

#### 列配置类型

**基础列配置**

```javascript
// 序号列
{ type: 'seq', width: 70, title: '序号' }

// 基础文本列
{
  field: 'name',
  title: '名称',
  minWidth: 150,
  showOverflow: 'tooltip', // 溢出显示工具提示
}

// 树节点列 (用于树形表格)
{
  field: 'menuName',
  title: '菜单名称',
  treeNode: true,
  minWidth: 200,
}

// 固定列
{
  field: 'actions',
  title: '操作',
  width: 280,
  fixed: 'right', // 'left' | 'right'
  slots: { default: 'action' },
}
```

**插槽列配置**

```javascript
// 自定义渲染列
{
  field: 'status',
  title: '状态',
  width: 90,
  slots: { default: 'status' },
}
```

#### 树形表格配置

```javascript
const gridOptions: VxeGridProps<MenuTreeType> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'menuName',
      title: '菜单名称',
      treeNode: true,        // 启用树节点
      minWidth: 200,
    },
    // 其他列...
  ],
  data: [],
  treeConfig: {
    parentField: 'parentMenuCode',  // 父级字段
    rowField: 'menuCode',          // 行唯一标识字段
    transform: true,               // 自动转换层级结构
    expandAll: false,              // 是否默认展开所有节点
  },
  pagerConfig: {
    enabled: false,                // 树形表格通常不使用分页
  },
  loading: false,
};
```

### 插槽内容定义

#### 状态标签插槽

```vue
<template #status="{ row }">
  <ElTag :type="getStatusTagType(row.status)">
    {{ getStatusText(row.status) }}
  </ElTag>
</template>

<script>
// 状态映射
const statusMap = {
  '0': { text: '禁用', type: 'danger' },
  '1': { text: '启用', type: 'success' },
} as const;

function getStatusTagType(status: string): 'danger' | 'success' {
  return statusMap[status as keyof typeof statusMap]?.type || 'success';
}

function getStatusText(status: string): string {
  return statusMap[status as keyof typeof statusMap]?.text || '未知';
}
</script>
```

#### 图标显示插槽

```vue
<template #icon="{ row }">
  <div class="flex items-center justify-center">
    <IconifyIcon
      v-if="row.icon && row.icon.trim()"
      :icon="row.icon"
      class="size-5"
    />
    <span v-else class="text-muted-foreground">-</span>
  </div>
</template>
```

#### 时间格式化插槽

```vue
<template #createdTime="{ row }">
  <span>{{ formatDateTime(row.createdTime) }}</span>
</template>

<script>
import dayjs from 'dayjs';

function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}
</script>
```

#### 操作按钮插槽

```vue
<template #action="{ row }">
  <ElButton type="primary" link size="small" @click="handleAdd(row.id)">
    新增子项
  </ElButton>
  <ElButton type="primary" link size="small" @click="handleEdit(row.id)">
    编辑
  </ElButton>
  <ElButton
    type="danger"
    link
    size="small"
    @click="handleDelete(row.id, row.name)"
  >
    删除
  </ElButton>
</template>
```

### 表格操作方法

#### 树形表格控制

```javascript
// 展开所有节点
function expandAll() {
  gridApi.grid?.setAllTreeExpand(true);
}

// 折叠所有节点
function collapseAll() {
  gridApi.grid?.setAllTreeExpand(false);
}

// 展开指定节点
function expandNode(row: any) {
  gridApi.grid?.setTreeExpand(row, true);
}
```

#### 数据更新

```javascript
// 更新表格数据
function updateTableData(newData: DataType[]) {
  gridApi.setState({
    gridOptions: {
      data: newData,
    },
  });
}

// 刷新数据
async function refreshData() {
  await loadDataList();
}
```

### 表格最佳实践

#### 1. 响应式列宽

```javascript
// 使用 minWidth 而非固定 width，提供更好的响应式体验
{
  field: 'description',
  title: '描述',
  minWidth: 200,          // 最小宽度
  showOverflow: 'tooltip', // 超出显示工具提示
}
```

#### 2. 加载状态管理

```javascript
async function loadData() {
  // 同时控制组件级和表格级加载状态
  loading.value = true;
  gridOptions.loading = true;

  try {
    // 数据加载逻辑
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}
```

#### 3. 工具栏操作

```vue
<template #toolbar-tools>
  <!-- 主要操作 -->
  <ElButton type="primary" @click="handleAdd()">新增</ElButton>

  <!-- 树形表格控制 -->
  <ElButton class="ml-2" @click="expandAll">展开全部</ElButton>
  <ElButton class="ml-2" @click="collapseAll">折叠全部</ElButton>

  <!-- 其他操作 -->
  <ElButton class="ml-2" @click="handleExport">导出</ElButton>
</template>
```

#### 4. 数据为空处理

```javascript
// 在数据加载中处理空数据
async function loadDataList() {
  try {
    const response = await getDataApi(params);
    const dataList = response || [];

    gridApi.setState({
      gridOptions: {
        data: dataList,
      },
    });
  } catch (error) {
    // 错误时设置空数据
    gridApi.setState({
      gridOptions: {
        data: [],
      },
    });
    gridOptions.data = [];
  }
}
```

#### 5. 类型安全

```typescript
// 定义数据类型
interface DataType {
  id: number;
  name: string;
  status: string;
  createdTime: string;
  // 树形数据特有字段
  parentId?: number;
  children?: DataType[];
}

// 在配置中使用类型
const gridOptions: VxeGridProps<DataType> = {
  // 配置内容...
};
```

### 表格与表单集成

#### 完整的增删改查示例

```vue
<script lang="ts" setup>
// 表格相关
const tableData = ref<DataType[]>([]);
const gridOptions: VxeGridProps<DataType> = {
  /* 配置 */
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 表单相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number>();
const [FormComponent, formApi] = useVbenForm({
  /* 配置 */
});

// CRUD 操作
async function handleAdd() {
  dialogTitle.value = '新增';
  isEdit.value = false;
  formApi.resetForm();
  dialogVisible.value = true;
}

async function handleEdit(id: number) {
  dialogTitle.value = '编辑';
  isEdit.value = true;
  currentId.value = id;

  const detail = await getDetailApi({ id });
  formApi.setValues(detail);
  dialogVisible.value = true;
}

async function handleDelete(id: number, name: string) {
  await ElMessageBox.confirm(`确定删除"${name}"吗？`);
  await deleteApi({ id });
  ElMessage.success('删除成功');
  loadDataList();
}

async function handleSave(values: Record<string, any>) {
  if (isEdit.value) {
    await updateApi({ ...values, id: currentId.value });
  } else {
    await createApi(values);
  }

  dialogVisible.value = false;
  loadDataList();
}
</script>

<template>
  <!-- 表格 -->
  <Grid table-title="数据管理">
    <template #toolbar-tools>
      <ElButton type="primary" @click="handleAdd()">新增</ElButton>
    </template>

    <template #action="{ row }">
      <ElButton link @click="handleEdit(row.id)">编辑</ElButton>
      <ElButton link type="danger" @click="handleDelete(row.id, row.name)">
        删除
      </ElButton>
    </template>
  </Grid>

  <!-- 表单对话框 -->
  <VbenModal v-model:open="dialogVisible" :title="dialogTitle">
    <FormComponent />
  </VbenModal>
</template>
```

这套表单和表格规范确保了：

1. **统一的开发体验** - 所有表单和表格使用相同的模式
2. **类型安全** - 完整的 TypeScript 支持
3. **高性能** - VxeTable 支持虚拟滚动和大数据处理
4. **易维护** - 声明式配置，逻辑清晰
5. **用户体验** - 响应式设计，交互友好

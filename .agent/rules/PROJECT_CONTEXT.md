# Project Context: Vue Vben Admin (v5)

## 🏗️ 架构概览 (Architecture Overview)
- **类型**: Monorepo (使用 Turbo + pnpm)
- **前端框架**: Vue 3 (Composition API)
- **语言**: TypeScript (严格模式)
- **包管理器**: pnpm (v10+)
- **构建工具**: Vite

## 📦 目录结构 (Directory Structure)
- `apps/`: 包含不同 UI 框架的应用
  - `web-antd`: Ant Design Vue 版本 (主要参考)
  - `web-ele`: Element Plus 版本
  - `web-naive`: Naive UI 版本
- `packages/`: 共享核心包
  - `@core`: 系统核心逻辑
  - `effects`: 业务副作用/逻辑封装
  - `stores`: Pinia 状态管理
  - `styles`: 全局样式定义
  - `utils`: 通用工具函数

## 🎨 开发风格与约定 (Code Style & Conventions)
- **组件开发**:
  - 强制使用 `<script setup>` 和 Composition API。
  - 样式使用 Tailwind CSS (或 UnoCSS)。
  - 组件命名遵循 PascalCase，单文件组件。
- **状态管理**: 使用 Pinia。
- **逻辑封装**: 优先使用 Hooks (useXxx) 进行逻辑提取。
- **API 交互**: 使用项目内置的请求客户端，遵循统一的响应格式。
- **Linting**: 严格遵守 `@vben/eslint-config` 和 Prettier 规范。

## 🛠️ 关键指令 (Key Commands)
- `pnpm dev`: 启动开发服务器 (Turbo 调度)。
- `pnpm dev:antd`: 仅启动 Ant Design Vue 版本。
- `pnpm lint`: 代码检查。
- `pnpm build`: 项目打包。

---
> 所有角色在执行开发任务前必须首先参考此上下文，确保生成的代码与项目既有风格完全一致。

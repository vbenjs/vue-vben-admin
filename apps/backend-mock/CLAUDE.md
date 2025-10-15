# CLAUDE.md - Backend Mock 模块文档

[根目录](../../../CLAUDE.md) > [apps](../../) > **backend-mock**

## 模块职责

Backend Mock 是基于 Nitro 框架的 Mock 后端服务，为前端应用提供模拟的 API 接口。它支持用户认证、权限管理、系统数据模拟等功能，使前端开发不依赖真实的后端服务。

## 入口与启动

- **配置文件**: `nitro.config.ts`
- **启动脚本**: `pnpm start`
- **构建脚本**: `pnpm build`
- **运行端口**: 默认 5320

## 对外接口

### 认证相关接口

- **登录**: `POST /auth/login`
- **登出**: `POST /auth/logout`
- **刷新令牌**: `POST /auth/refresh`
- **获取权限码**: `GET /auth/codes`

### 系统管理接口

- **部门管理**: `GET /system/dept/list`, `PUT /system/dept/[id]`, `DELETE /system/dept/[id]`
- **菜单管理**: `GET /system/menu/list`, `GET /system/menu/name-exists`, `GET /system/menu/path-exists`
- **角色管理**: `GET /system/role/list`

### 用户接口

- **用户信息**: `GET /user/info`

### 通用接口

- **表格数据**: `GET /table/list`
- **文件上传**: `POST /upload`
- **状态检查**: `GET /status`
- **测试接口**: `GET /test`, `POST /test`

## 关键依赖与配置

### 依赖包

- **nitropack**: Nitro 框架
- **jsonwebtoken**: JWT 令牌处理
- **@faker-js/faker**: 模拟数据生成
- **h3**: HTTP 处理库

### CORS 配置

支持跨域请求，配置了完整的 CORS 头信息，允许所有来源的请求。

### 中间件

- **API 中间件**: 统一处理 API 请求，添加 CORS 头

## 数据模型

### 用户认证模型

- **登录参数**: `LoginParams { username?, password? }`
- **登录结果**: `LoginResult { accessToken }`
- **刷新令牌**: `RefreshTokenResult { data: string, status: number }`

### 模拟数据

- 使用 `mock-data.ts` 生成模拟的部门、菜单、角色等数据
- 支持动态生成用户信息和权限数据

## 测试与质量

### 错误处理

- 统一的错误处理机制，通过 `error.ts` 处理各种错误情况
- 支持开发环境和生产环境的不同错误处理策略

### 工具函数

- **JWT 工具**: `jwt-utils.ts` 处理 JWT 令牌的生成和验证
- **Cookie 工具**: `cookie-utils.ts` 处理 Cookie 操作
- **响应工具**: `response.ts` 统一处理 API 响应格式

## 常见问题 (FAQ)

### 如何添加新的 API 接口？

1. 在 `api/` 目录下创建对应的路由文件
2. 文件命名遵循 RESTful 规范，如 `user.get.ts`、`user.post.ts`
3. 使用 Nitro 提供的 `event` 对象处理请求和响应

### 如何修改模拟数据？

修改 `utils/mock-data.ts` 文件中的数据生成逻辑，可以自定义各种模拟数据的格式和内容。

### 如何处理认证？

所有需要认证的接口都应该验证 JWT 令牌，可以使用 `utils/jwt-utils.ts` 中的工具函数。

## 相关文件清单

- `nitro.config.ts` - Nitro 配置文件
- `error.ts` - 错误处理
- `middleware/1.api.ts` - API 中间件
- `routes/[...].ts` - 通用路由处理
- `api/` - API 接口目录
- `utils/` - 工具函数目录

## 变更记录 (Changelog)

- 2025-10-15: 初始化模块文档

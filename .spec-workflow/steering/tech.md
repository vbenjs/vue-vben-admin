# Technology Stack

## Project Type

FactoryOS 是一个现代化的企业级工厂管理系统，采用 **Monorepo 架构的 Web 应用程序**。基于 Vue Vben Admin 5.5.9 框架构建，专为制造业提供全面的数字化管理解决方案。

## Core Technologies

### Primary Language(s)

- **TypeScript 5.8+**: 主要开发语言，提供类型安全和现代 JavaScript 特性
- **JavaScript (ES2023)**: 用于配置文件和构建脚本
- **Vue 3.5+**: 渐进式 JavaScript 框架，采用 Composition API
- **CSS3**: 样式设计，支持 Tailwind CSS 和 Ant Design Vue

### Key Dependencies/Libraries

**核心框架**:

- **Vue 3.5+**: 现代化前端框架，提供响应式数据和组件系统
- **Pinia 3.0+**: Vue 官方状态管理库，替代 Vuex
- **Vue Router 4.x**: 官方路由管理器
- **TypeScript 5.8+**: 类型安全的 JavaScript 超集

**UI 框架**:

- **Ant Design Vue 4.2+**: 企业级 UI 设计语言和组件库
- **Tailwind CSS 3.4+**: 实用优先的 CSS 框架
- **Shadcn UI**: 现代化组件库，基于 Radix UI

**构建工具**:

- **Vite 7.1+**: 现代前端构建工具，提供快速开发体验
- **Turbo**: Monorepo 构建工具，优化构建性能
- **pnpm 10.14+**: 快速、节省磁盘空间的包管理器

**开发工具**:

- **ESLint**: JavaScript 和 TypeScript 代码检查工具
- **Prettier**: 代码格式化工具
- **Stylelint**: CSS 样式检查工具
- **Vitest**: 基于 Vite 的单元测试框架
- **Playwright**: 端到端测试框架

**Mock 服务**:

- **Nitro**: 基于 Nuxt 的现代化服务器端框架，用于 Mock API

### Application Architecture

**Monorepo 架构**:

- 使用 pnpm workspace 管理多包项目
- Turbo 构建系统优化构建性能
- 模块化设计，支持独立开发和部署

**分层架构**:

- **应用层 (apps/)**: 具体的应用程序实例
- **核心层 (packages/@core/)**: 核心功能和共享组件
- **效果层 (packages/effects/)**: 业务功能和插件
- **工具层 (packages/utils/)**: 通用工具和常量

**模块化设计**:

- **@core/base**: 基础功能（设计系统、共享工具、类型定义）
- **@core/composables**: Vue 组合式函数
- **@core/ui-kit**: UI 组件库
- **effects**: 功能效果包（布局、插件等）

### Data Storage

**前端数据管理**:

- **Pinia Store**: 应用状态管理
- **LocalStorage**: 本地数据持久化
- **SessionStorage**: 会话数据存储
- **IndexedDB**: 大量客户端数据存储

**数据格式**:

- **JSON**: 主要数据交换格式
- **TypeScript Interfaces**: 类型定义和验证
- **Protocol Buffers**: 未来可能用于高性能数据传输

### External Integrations

**API 集成**:

- **RESTful API**: 标准的 HTTP 接口通信
- **WebSocket**: 实时数据推送和通信
- **GraphQL**: 灵活的数据查询语言（未来计划）

**认证授权**:

- **JWT**: JSON Web Token 认证
- **OAuth 2.0**: 第三方登录集成
- **RBAC**: 基于角色的访问控制

**第三方服务**:

- **地图服务**: 生产车间可视化（未来计划）
- **消息推送**: 实时通知系统
- **文件存储**: 附件和文档管理

### Monitoring & Dashboard Technologies

**实时监控**:

- **WebSocket**: 实时数据更新
- **Server-Sent Events**: 单向数据推送
- **轮询机制**: 兼容性数据更新方案

**数据可视化**:

- **ECharts**: 企业级数据可视化图表库
- **D3.js**: 自定义数据可视化
- **Canvas API**: 高性能图形渲染

**状态管理**:

- **Pinia**: 全局状态管理
- **Vue Reactivity**: 组件级响应式状态
- **Local Storage**: 持久化状态存储

## Development Environment

### Build & Development Tools

**构建系统**:

- **Vite**: 现代化构建工具，支持 HMR 和快速构建
- **Turbo**: Monorepo 构建优化，支持增量构建
- **TypeScript**: 类型检查和编译

**包管理**:

- **pnpm**: 高效的包管理器，支持 monorepo
- **Workspace**: 内部包依赖管理
- **Catalog**: 统一版本管理

**开发工作流**:

- **热重载**: 开发时即时更新
- **类型检查**: 实时 TypeScript 类型验证
- **代码检查**: ESLint 实时代码质量检查

### Code Quality Tools

**静态分析**:

- **ESLint**: JavaScript/TypeScript 代码检查
- **TypeScript**: 编译时类型检查
- **Stylelint**: CSS 样式检查
- **CSpell**: 拼写检查

**代码格式化**:

- **Prettier**: 统一代码格式
- **EditorConfig**: 编辑器配置统一
- **Lint-staged**: Git 提交前检查

**测试框架**:

- **Vitest**: 单元测试和集成测试
- **Playwright**: 端到端测试
- **Vue Test Utils**: Vue 组件测试工具
- **Happy DOM**: 轻量级 DOM 测试环境

**文档生成**:

- **VitePress**: 文档网站生成
- **TypeDoc**: API 文档生成
- **Storybook**: 组件文档和测试

### Version Control & Collaboration

**版本控制**:

- **Git**: 分布式版本控制系统
- **GitHub**: 代码托管和协作平台
- **Conventional Commits**: 规范化提交信息

**分支策略**:

- **Git Flow**: 分支管理工作流
- **Feature Branches**: 功能开发分支
- **Release Branches**: 发布版本分支

**代码审查**:

- **Pull Request**: 代码合并审查
- **Code Review**: 团队代码审查流程
- **Automated Checks**: 自动化检查流程

### Dashboard Development

**实时重载**:

- **Hot Module Replacement**: 模块热替换
- **File Watchers**: 文件变化监控
- **Live Reload**: 页面自动刷新

**端口管理**:

- **动态端口分配**: 开发环境端口配置
- **多实例支持**: 同时运行多个应用
- **代理配置**: 开发环境 API 代理

## Deployment & Distribution

**目标平台**:

- **Web 浏览器**: Chrome、Firefox、Safari、Edge
- **Node.js**: 服务端渲染和构建
- **Docker**: 容器化部署
- **云平台**: AWS、Azure、阿里云等

**分发方式**:

- **静态文件**: CDN 分发
- **Docker 镜像**: 容器化部署
- **Nginx**: Web 服务器部署
- **Vercel/Netlify**: 无服务器部署

**安装要求**:

- **Node.js >= 20.10.0**: 运行环境
- **pnpm >= 9.12.0**: 包管理器
- **现代浏览器**: 支持 ES2023+ 特性
- **4GB+ RAM**: 开发环境内存要求

**更新机制**:

- **语义化版本**: 遵循 SemVer 规范
- **自动化构建**: CI/CD 流水线
- **增量更新**: 支持热更新和增量部署
- **回滚机制**: 快速回滚到稳定版本

## Technical Requirements & Constraints

### Performance Requirements

**响应时间**:

- **页面加载**: 首屏加载时间 < 3秒
- **交互响应**: 用户操作响应时间 < 200ms
- **数据更新**: 实时数据更新延迟 < 1秒

**内存使用**:

- **运行时内存**: 浏览器内存使用 < 200MB
- **构建内存**: 构建过程内存使用 < 4GB
- **内存泄漏**: 零内存泄漏，定期内存检查

**并发处理**:

- **用户并发**: 支持 1000+ 并发用户
- **API 请求**: 支持高并发 API 调用
- **实时连接**: 支持 10000+ WebSocket 连接

### Compatibility Requirements

**平台支持**:

- **操作系统**: Windows 10+、macOS 10.15+、Ubuntu 18.04+
- **浏览器**: Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- **移动端**: iOS Safari 14+、Android Chrome 90+

**依赖版本**:

- **Node.js**: >= 20.10.0
- **pnpm**: >= 9.12.0
- **TypeScript**: >= 5.8.0
- **Vue**: >= 3.5.0

**标准合规**:

- **ECMAScript**: ES2023 标准
- **CSS**: CSS3 和现代 CSS 特性
- **HTML**: HTML5 标准
- **HTTP**: HTTP/1.1 和 HTTP/2

### Security & Compliance

**安全要求**:

- **HTTPS**: 强制使用 HTTPS 通信
- **CORS**: 跨域资源共享配置
- **XSS防护**: 跨站脚本攻击防护
- **CSRF防护**: 跨站请求伪造防护

**数据保护**:

- **数据加密**: 敏感数据传输加密
- **访问控制**: 基于角色的访问控制
- **数据脱敏**: 敏感信息脱敏处理
- **审计日志**: 用户操作审计记录

**合规标准**:

- **GDPR**: 欧盟数据保护法规
- **等保**: 中国网络安全等级保护
- **ISO 27001**: 信息安全管理体系

### Scalability & Reliability

**预期负载**:

- **日活用户**: 10000+ DAU
- **并发用户**: 1000+ 在线用户
- **数据量**: TB 级数据存储
- **API 调用**: 百万级日调用量

**可用性要求**:

- **系统可用性**: 99.9% 可用性
- **故障恢复**: 故障恢复时间 < 30分钟
- **数据备份**: 每日自动备份
- **灾难恢复**: 完整的灾难恢复方案

**增长规划**:

- **水平扩展**: 支持集群部署
- **垂直扩展**: 支持硬件升级
- **微服务**: 未来微服务架构迁移
- **云原生**: 支持云原生部署

## Technical Decisions & Rationale

### Decision Log

1. **Vue 3 + TypeScript**: 选择 Vue 3 而非 React，因为其更简单的学习曲线和更好的 TypeScript 支持。TypeScript 提供类型安全，减少运行时错误。

2. **Vite 构建工具**: 选择 Vite 而非 Webpack，因为其极快的开发服务器启动速度和热更新速度，大幅提升开发体验。

3. **Monorepo 架构**: 采用 pnpm + Turbo 的 monorepo 方案，便于代码共享、统一依赖管理和构建优化。

4. **Ant Design Vue**: 选择成熟的企业级 UI 组件库，减少开发成本，保证视觉一致性。

5. **Pinia 状态管理**: 选择 Pinia 而非 Vuex，因为其更简洁的 API、更好的 TypeScript 支持和更小的包体积。

6. **Nitro Mock 服务**: 使用 Nitro 提供 Mock API，减少对后端的依赖，支持并行开发。

7. **Playwright E2E 测试**: 选择 Playwright 而非 Cypress，因为其更好的跨浏览器支持和更稳定的测试执行。

## Known Limitations

**当前限制**:

- **浏览器兼容性**: 不支持 IE 浏览器，可能影响部分企业用户
- **移动端适配**: 主要针对桌面端设计，移动端体验有待优化
- **离线支持**: 目前缺乏完整的离线功能支持
- **实时性**: WebSocket 连接在网络不稳定时可能断开

**技术债务**:

- **构建时间**: 大型项目构建时间较长，需要进一步优化
- **包体积**: 首次加载包体积较大，影响加载速度
- **测试覆盖**: 单元测试覆盖率有待提高
- **文档完善**: API 文档和组件文档需要进一步完善

**改进计划**:

- **性能优化**: 实现代码分割和懒加载，减少首屏加载时间
- **PWA 支持**: 添加 PWA 功能，支持离线使用
- **移动端优化**: 增强移动端适配和交互体验
- **微前端架构**: 未来考虑迁移到微前端架构，提升可维护性

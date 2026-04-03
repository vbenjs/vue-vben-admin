---
description: 一键重启 RISS 全环境 (Docker + 后端 + 前端), 也可单独重启前端或后端
---

# /restart - RISS 一键重启

自动完成: 清理旧进程 → 启动 Docker 容器 → 启动后端 → 启动前端

## 全量重启 (推荐)

// turbo
1. 运行一键重启脚本:
```
powershell -ExecutionPolicy Bypass -File scripts/restart-all.ps1
```

## 仅重启前端

// turbo
1. 运行前端重启:
```
powershell -ExecutionPolicy Bypass -File scripts/restart-all.ps1 -FrontendOnly
```

## 仅重启后端

// turbo
1. 运行后端重启:
```
powershell -ExecutionPolicy Bypass -File scripts/restart-all.ps1 -BackendOnly
```

## 跳过 Docker

// turbo
1. 跳过 Docker 容器启动 (仅重启 Node 服务):
```
powershell -ExecutionPolicy Bypass -File scripts/restart-all.ps1 -SkipDocker
```

## 说明

- **全量重启**: 清理旧进程 → Docker (MySQL:3307 + Redis:16379) → NestJS (5555) → Vite (5666)
- **前端**: http://localhost:5666/
- **后端 API**: http://localhost:5555/api
- 脚本位于 `scripts/restart-all.ps1`
- package.json 快捷命令: `pnpm restart` / `pnpm restart:frontend` / `pnpm restart:backend`

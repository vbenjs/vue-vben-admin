# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a **Vue Vben Admin 5.0** application built with Vue 3, Vite, and TypeScript in a pnpm monorepo workspace.

### Core Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm build:analyze` - Build with bundle analysis
- `pnpm preview` - Preview production build locally
- `pnpm typecheck` - Run TypeScript type checking

### Workspace Commands (from root)

- `pnpm install` - Install all dependencies across workspace
- `turbo dev` - Run development across all apps
- `turbo build` - Build all applications
- `turbo typecheck` - Type check all packages

## Architecture Overview

### Monorepo Structure

This app is located at `apps/web-np` within a larger monorepo using pnpm workspaces and Turbo for build orchestration. The workspace includes:

- Internal tools (`internal/*`) - Shared configurations (Vite, TypeScript, Tailwind)
- Core packages (`packages/@core/*`) - Base UI components and utilities
- Business packages (`packages/business/*`) - Domain-specific components
- Multiple applications (`apps/*`)

### Application Architecture

Built on **Vue Vben Admin 5.0** framework with the following key architectural patterns:

**Bootstrap Process:**

1. `main.ts` → `initApplication()` - Sets up namespace-based preferences
2. `bootstrap.ts` - Initializes core services (i18n, stores, router, directives)
3. `app.vue` - Main application component

**Core Systems:**

- **Preferences System**: Namespace-based configuration (`@vben/preferences`)
- **State Management**: Pinia with workspace stores (`@vben/stores`)
- **Routing**: Vue Router with dynamic guards and meta-based permissions
- **Internationalization**: Vue i18n with dynamic loading
- **UI Framework**: Ant Design Vue with custom theming
- **Component Adapter**: Pluggable UI component system

### Key Directories

- `src/api/` - API service layer organized by domain (core/, shop.ts)
- `src/views/` - Page components (ads/, dashboard/, onboard/, reports/)
- `src/store/` - Pinia stores (shop, currency, system-statistic, shopify-app-bridge)
- `src/router/` - Route definitions and guards
- `src/layouts/` - Layout components
- `src/shared/` - Shared utilities and services
- `src/adapter/` - Component adapters for UI framework integration

### Configuration

- **Vite**: Custom config extending `@vben/vite-config` with API proxy to `localhost:5320`
- **TypeScript**: Extends `@vben/tsconfig/web-app.json` with path mapping (`#/*` → `./src/*`)
- **Environment**: Multiple env files for development, production, UAT with Shopify app integration
- **Build**: Turbo orchestration with dependency-aware builds and caching

### Key Dependencies

- **Framework**: Vue 3.5, Vite 6.3, TypeScript 5.8
- **UI**: Ant Design Vue 4.2, VXE Table, Radix Vue
- **State**: Pinia 3.0 with persistence plugin
- **Utilities**: VueUse, dayjs, lodash utilities
- **Shopify**: `@shopify/app-bridge` for embedded app functionality

### Development Notes

- Uses hash-based routing by default (configurable via `VITE_ROUTER_HISTORY`)
- Namespace-based preference isolation for multi-tenant scenarios
- Crisp SDK integration for customer support
- Dynamic title updates based on route meta
- Comprehensive directive system (loading, access control)

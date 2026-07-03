---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
sidebar: false

hero:
  name: Vben Admin
  text: 企业级管理系统框架
  tagline: 全新升级，开箱即用，简单高效
  image:
    src: https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp
    alt: Vben Admin
  actions:
    - theme: brand
      text: 快速开始 ->
      link: /guide/introduction/vben
    - theme: alt
      text: 在线预览
      link: https://www.vben.pro
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/vbenjs/vue-vben-admin
    - theme: alt
      text: DeepWiki 文档
      link: https://deepwiki.com/vbenjs/vue-vben-admin

features:
  - icon: 🚀
    title: 最新技术栈
    details: 基于 Vue3、Pinia、Vue Router、TypeScript、等最新技术栈。
    link: /guide/introduction/quick-start
    linkText: 快速开始
  - icon: 🦄
    title: 丰富的配置
    details: 企业级中后台前端解决方案，提供丰富的组件和模板以及 N 种偏好设置组合方案。
    link: /guide/essentials/settings
    linkText: 配置文档
  - icon: 🎨
    title: 主题定制
    details: 通过简单的配置，即可实现各种主题切换，满足个性化需求。
    link: /guide/in-depth/theme
    linkText: 主题文档
  - icon: 🌐
    title: 国际化
    details: 内置国际化方案，支持多语言切换，满足国际化需求。
    link: /guide/in-depth/locale
    linkText: 国际化文档
  - icon: 🔐
    title: 权限管理
    details: 内置权限管理方案，支持多种权限控制方式，满足各种权限需求。
    link: /guide/in-depth/access
    linkText: 权限文档
  - title: Vite
    icon:
      src: /logos/vite.svg
    details: 现代化的前端构建工具，快速冷启动，瞬间热更新。
    link: https://vitejs.dev/
    linkText: 官方站点
  - title: Shadcn UI
    icon:
      src: /logos/shadcn-ui.svg
    details: 核心基于 Shadcn UI + Tailwindcss，业务可支持任意的 UI 框架。
    link: https://www.shadcn-vue.com/
    linkText: 官方站点
  - title: Turbo Repo
    icon:
      src: /logos/turborepo.svg
    details: 规范且标准的大仓架构，使用 pnpm + monorepo + turbo 工程管理模式，提供企业级开发规范。
    link: https://turbo.build/
    linkText: 官方站点
  - title: Nitro Mock Server
    icon:
      src: /logos/nitro.svg
    details: 内置 Nitro Mock 服务，让你的 mock 服务更加强大。
    link: https://nitro.build/
    linkText: 官方站点
---

<!-- <script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme';

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/28132598?v=4',
    name: 'Vben',
    title: '创建者',
    desc: 'Vben Admin以及相关生态的作者，负责项目的整体开发。',
    links: [
      { icon: 'github', link: 'https://github.com/anncwb' },
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      核心成员介绍
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage> -->

<VbenContributors />

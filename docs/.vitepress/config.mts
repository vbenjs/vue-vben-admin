import type { DefaultTheme, HeadConfig } from 'vitepress';

import { resolve } from 'node:path';

import { type PwaOptions, withPwa } from '@vite-pwa/vitepress';
import { defineConfigWithTheme } from 'vitepress';

import { version } from '../../package.json';

export default withPwa(
  defineConfigWithTheme({
    description: 'Vben Admin& 企业级管理系统框架',
    head: head(),
    lang: 'zh',
    pwa: pwa(),
    // locales: {
    //   en: {
    //     label: 'English',
    //     lang: 'en',
    //     link: '/en/',
    //   },
    //   root: {
    //     label: '简体中文',
    //     lang: 'zh-CN',
    srcDir: 'src',
    //   },
    themeConfig: {
      darkModeSwitchLabel: '主题',
      darkModeSwitchTitle: '切换到深色模式',
      docFooter: {
        next: '下一页',
        prev: '上一页',
      },
      editLink: {
        pattern:
          'https://github.com/vbenjs/vue-vben-admin/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页面',
      },
      footer: {
        copyright: `Copyright © 2020-${new Date().getFullYear()} Vben`,
        message: '基于 MIT 许可发布.',
      },
      i18nRouting: true,
      langMenuLabel: '多语言',
      lastUpdated: {
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'medium',
        },
        text: '最后更新于',
      },
      lightModeSwitchTitle: '切换到浅色模式',
      logo: 'https://unpkg.com/@vbenjs/static-source@0.1.5/source/logo-v1.webp',
      nav: nav(),
      outline: {
        label: '页面导航',
      },
      returnToTopLabel: '回到顶部',
      search: {
        options: {
          locales: {
            zh: {
              translations: {
                button: {
                  buttonAriaLabel: '搜索文档',
                  buttonText: '搜索文档',
                },
                modal: {
                  footer: {
                    navigateText: '切换',
                    selectText: '选择',
                  },
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                },
              },
            },
          },
        },
        provider: 'local',
      },
      sidebar: {
        '/commercial/': { base: '/commercial/', items: sidebarCommercial() },
        '/guide/': { base: '/guide/', items: sidebarGuide() },
      },
      sidebarMenuLabel: '菜单',
      siteTitle: 'Vben Admin',
      socialLinks: [
        { icon: 'github', link: 'https://github.com/vbenjs/vue-vben-admin' },
      ],
    },
    title: 'Vben Admin',
    vite: {
      build: {
        chunkSizeWarningLimit: Infinity,
        minify: 'terser',
      },
      json: {
        stringify: true,
      },
      server: {
        fs: {
          allow: ['../..'],
        },
        host: true,
        port: 6173,
      },
      ssr: {
        external: ['@vue/repl'],
      },
    },
  }),
);

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '文档',
      items: [
        {
          link: '/guide/introduction/vben',
          text: '指南',
          // items: [
          //   {
          //     link: '/guide/introduction/vben',
          //     text: '简介',
          //   },
          //   {
          //     link: '/guide/essentials/concept',
          //     text: '基础',
          //   },
          //   {
          //     link: '/guide/in-depth/layout',
          //     text: '深入',
          //   },
          //   {
          //     link: '/guide/project/standard',
          //     text: '工程',
          //   },
          //   {
          //     link: '/guide/other/project-update',
          //     text: '其他',
          //   },
          // ],
        },
        {
          text: '历史版本',
          items: [
            {
              link: 'https://doc.vvbin.cn',
              text: '2.x版本文档',
            },
          ],
        },
      ],
    },
    {
      text: '演示',
      items: [
        {
          text: 'Vben Admin',
          items: [
            {
              link: 'https://www.vben.pro',
              text: 'Ant Design Vue 版本(默认)',
            },
            {
              link: 'https://naive.vben.pro',
              text: 'Naive 版本',
            },
            {
              link: 'https://ele.vben.pro',
              text: 'Element Plus版本',
            },
          ],
        },
        {
          text: '其他',
          items: [
            {
              link: 'https://vben.vvbin.cn',
              text: 'Vben Admin 2.x',
            },
          ],
        },
      ],
    },
    {
      text: version,
      items: [
        {
          link: 'https://github.com/vbenjs/vue-vben-admin/releases',
          text: '更新日志',
        },
        {
          link: 'https://github.com/orgs/vbenjs/projects/5',
          text: '路线图',
        },
        {
          link: 'https://github.com/vbenjs/vue-vben-admin/blob/main/.github/contributing.md',
          text: '贡献',
        },
      ],
    },
    {
      link: '/commercial/technical-support',
      text: '🦄 技术支持',
    },
    {
      link: '/sponsor/personal',
      text: '✨ 赞助',
    },
    {
      link: '/commercial/community',
      text: '👨‍👦‍👦 社区交流',
      // items: [
      //   {
      //     link: 'https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=22ySzj7pKiw&businessType=9&from=246610&biz=ka&mainSourceId=share&subSourceId=others&jumpsource=shorturl#/pc',
      //     text: 'QQ频道',
      //   },
      //   {
      //     link: 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mjZmlhgVzzUxvdxllB6C1vHpX8O8QRL0&authKey=DBdFbBwERmfaKY95JvRWqLCJIRGJAmKyZbrpzZ41EKDMZ5SR6MfbjOBaaNRN73fr&noverify=0&group_code=4286109',
      //     text: 'QQ群',
      //   },
      //   {
      //     link: 'https://discord.gg/VU62jTecad',
      //     text: 'Discord',
      //   },
      // ],
    },
    {
      link: '/friend-links/',
      text: '🤝 友情链接',
    },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      collapsed: false,
      text: '简介',
      items: [
        {
          link: 'introduction/vben',
          text: '关于 Vben Admin',
        },
        {
          link: 'introduction/why',
          text: '为什么选择我们?',
        },
        { link: 'introduction/quick-start', text: '快速开始' },
      ],
    },
    {
      text: '基础',
      items: [
        { link: 'essentials/concept', text: '基础概念' },
        { link: 'essentials/development', text: '本地开发' },
        { link: 'essentials/route', text: '路由和菜单' },
        { link: 'essentials/settings', text: '配置' },
        { link: 'essentials/icons', text: '图标' },
        { link: 'essentials/styles', text: '样式' },
        { link: 'essentials/external-module', text: '外部模块' },
        { link: 'essentials/build', text: '构建与部署' },
        { link: 'essentials/server', text: '服务端交互与数据Mock' },
      ],
    },
    {
      text: '深入',
      items: [
        // { link: 'in-depth/layout', text: '布局' },
        { link: 'in-depth/theme', text: '主题' },
        { link: 'in-depth/access', text: '权限' },
        { link: 'in-depth/locale', text: '国际化' },
        { link: 'in-depth/features', text: '常用功能' },
        { link: 'in-depth/check-updates', text: '检查更新' },
        { link: 'in-depth/loading', text: '全局loading' },
        { link: 'in-depth/ui-framework', text: '组件库切换' },
      ],
    },
    {
      text: '工程',
      items: [
        { link: 'project/standard', text: '规范' },
        { link: 'project/cli', text: 'CLI' },
        { link: 'project/test', text: '单元测试' },
        { link: 'project/tailwindcss', text: 'Tailwind CSS' },
        { link: 'project/changeset', text: 'Changeset' },
        { link: 'project/vite', text: 'Vite Config' },
      ],
    },
    {
      text: '其他',
      items: [
        { link: 'other/project-update', text: '项目更新' },
        { link: 'other/remove-code', text: '移除代码' },
        { link: 'other/faq', text: '常见问题' },
      ],
    },
  ];
}
function sidebarCommercial(): DefaultTheme.SidebarItem[] {
  return [
    {
      link: 'community',
      text: '社区交流',
    },
    {
      link: 'technical-support',
      text: '技术支持',
    },
    {
      link: 'customized',
      text: '定制开发',
    },
  ];
}

function head(): HeadConfig[] {
  return [
    ['meta', { content: 'Vbenjs Team', name: 'author' }],
    [
      'meta',
      {
        content: 'vben, vitejs, vite, shacdn-ui, vue',
        name: 'keywords',
      },
    ],
    ['link', { href: '/favicon.ico', rel: 'icon', type: 'image/svg+xml' }],
    [
      'meta',
      {
        content:
          'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
        name: 'viewport',
      },
    ],
    ['meta', { content: 'vben admin docs', name: 'keywords' }],
    ['link', { href: '/favicon.ico', rel: 'icon' }],
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.tailwindcss.com',
    //   },
    // ],
  ];
}

function pwa(): PwaOptions {
  return {
    includeManifestIcons: false,
    manifest: {
      description:
        'Vben Admin is a modern admin dashboard template based on Vue 3. ',
      icons: [
        {
          sizes: '192x192',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.5/source/pwa-icon-192.png',
          type: 'image/png',
        },
        {
          sizes: '512x512',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.5/source/pwa-icon-512.png',
          type: 'image/png',
        },
      ],
      id: '/',
      name: 'Vben Admin Doc',
      short_name: 'vben_admin_doc',
      theme_color: '#ffffff',
    },
    outDir: resolve(process.cwd(), '.vitepress/dist'),
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
    },
  };
}

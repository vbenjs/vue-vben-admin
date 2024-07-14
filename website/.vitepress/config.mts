import { defineConfigWithTheme } from 'vitepress';

export default defineConfigWithTheme({
  description: 'Vue Vben Admin & 企业级管理系统框架',
  lang: 'zh-CN',

  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/index',
    },
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },
  srcDir: 'src',
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/vbenjs/vue-vben-admin/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      copyright: 'Copyright © 2024-present Vben Admin',
    },
    i18nRouting: true,
    logo: 'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.3/source/logo-v1.webp',
    nav: [
      { link: '/', text: 'Home' },
      { link: '/markdown-examples', text: 'Examples' },
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { link: '/markdown-examples', text: 'Markdown Examples' },
          { link: '/api-examples', text: 'Runtime API Examples' },
        ],
      },
    ],
    siteTitle: 'Vben Admin',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vbenjs/vue-vben-admin' },
    ],
  },
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
});

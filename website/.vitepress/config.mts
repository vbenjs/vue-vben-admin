import { defineConfigWithTheme } from 'vitepress';

export default defineConfigWithTheme({
  description: 'Vben Admin Pro Doc',
  lang: 'zh-CN',
  srcDir: 'src',
  themeConfig: {
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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  title: 'Vben Admin Pro',
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

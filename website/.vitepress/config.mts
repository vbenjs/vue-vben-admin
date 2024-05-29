import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
  title: 'My Awesome Project',
  vite: {
    server: { port: 6173 },
  },
});

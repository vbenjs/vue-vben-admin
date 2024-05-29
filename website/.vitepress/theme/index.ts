// https://vitepress.dev/guide/custom-theme
import './style.css';

import type { Theme } from 'vitepress';

import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';

export default {
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  extends: DefaultTheme,
} satisfies Theme;

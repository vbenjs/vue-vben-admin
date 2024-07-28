// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';

import DefaultTheme from 'vitepress/theme';

import SiteLayout from './components/site-layout.vue';
import VbenContributors from './components/vben-contributors.vue';

import './styles';

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('VbenContributors', VbenContributors);
  },
  extends: DefaultTheme,
  Layout: SiteLayout,
} satisfies Theme;

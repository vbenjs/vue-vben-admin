// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client';
import DefaultTheme from 'vitepress/theme';

import SiteLayout from './components/site-layout.vue';
import VbenContributors from './components/vben-contributors.vue';
import { initHmPlugin } from './plugins/hm';

import './styles';

import '@nolebase/vitepress-plugin-git-changelog/client/style.css';

export default {
  enhanceApp({ app }) {
    // ...
    app.component('VbenContributors', VbenContributors);
    app.use(NolebaseGitChangelogPlugin);
    // 百度统计
    initHmPlugin();
  },
  extends: DefaultTheme,
  Layout: SiteLayout,
} satisfies Theme;

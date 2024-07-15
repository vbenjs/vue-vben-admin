import type { RouteRecordRaw } from 'vue-router';

import { VBEN_GITHUB_URL, VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      badgeType: 'dot',
      icon: VBEN_LOGO_URL,
      order: 9999,
      title: 'Vben',
    },
    name: 'AboutLayout',
    path: '/vben-admin',
    redirect: '/vben-admin/about',
    children: [
      {
        name: 'VbenAbout',
        path: 'about',
        component: () => import('#/views/_core/vben/about/index.vue'),
        meta: {
          badgeType: 'dot',
          icon: 'mdi:creative-commons',
          title: $t('page.vben.about'),
        },
      },
      {
        name: 'VbenDocument',
        path: 'document',
        component: IFrameView,
        meta: {
          icon: 'mdi:flame-circle',
          iframeSrc: 'https://doc.vvbin.cn/',
          keepAlive: true,
          title: $t('page.vben.document'),
        },
      },
      {
        name: 'VbenGithub',
        path: 'github',
        component: IFrameView,
        meta: {
          icon: 'mdi:github',
          link: VBEN_GITHUB_URL,
          title: 'Github',
        },
      },
    ],
  },
];

export default routes;

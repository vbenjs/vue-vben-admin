import type { RouteRecordRaw } from 'vue-router';

import { VBEN_GITHUB_URL, VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      badgeType: 'dot',
      badgeVariants: 'destructive',
      icon: VBEN_LOGO_URL,
      order: 9999,
      title: $t('page.vben.title'),
    },
    name: 'VbenProject',
    path: '/vben-admin',
    redirect: '/vben-admin/about',
    children: [
      {
        name: 'VbenAbout',
        path: 'about',
        component: () => import('#/views/_core/vben/about/index.vue'),
        meta: {
          badgeType: 'dot',
          badgeVariants: 'destructive',
          icon: 'lucide:copyright',
          title: $t('page.vben.about'),
        },
      },
      {
        name: 'VbenDocument',
        path: 'document',
        component: IFrameView,
        meta: {
          icon: 'lucide:book-open-text',
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

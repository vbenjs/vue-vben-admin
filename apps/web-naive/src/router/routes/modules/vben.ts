import type { RouteRecordRaw } from 'vue-router';

import { VBEN_DOC_URL, VBEN_GITHUB_URL, VBEN_LOGO_URL } from '@vben/constants';

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
    children: [
      {
        name: 'VbenAbout',
        path: '/vben-admin/about',
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
        path: '/vben-admin/document',
        component: IFrameView,
        meta: {
          icon: 'lucide:book-open-text',
          iframeSrc: VBEN_DOC_URL,
          keepAlive: true,
          title: $t('page.vben.document'),
        },
      },
      {
        name: 'VbenGithub',
        path: '/vben-admin/github',
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

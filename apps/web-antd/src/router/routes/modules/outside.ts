import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales/helper';

import { BasicLayout, IFrameView } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:round-settings-input-composite',
      title: $t('page.outside.page'),
    },
    name: 'Outside',
    path: '/outside',
    redirect: '/outside/iframe',
    children: [
      {
        name: 'iframe',
        path: 'iframe',
        meta: {
          icon: 'mdi:newspaper-variant-outline',
          title: $t('page.outside.embedded'),
        },
        redirect: '/outside/iframe/vue-document',
        children: [
          {
            name: 'VueDocument',
            path: 'vue-document',
            component: IFrameView,
            meta: {
              icon: 'logos:vue',
              iframeSrc: 'https://cn.vuejs.org/',
              keepAlive: true,
              title: 'Vue',
            },
          },
          {
            name: 'Tailwindcss',
            path: 'tailwindcss',
            component: IFrameView,
            meta: {
              icon: 'devicon:tailwindcss',
              iframeSrc: 'https://tailwindcss.com/',
              // keepAlive: true,
              title: 'Tailwindcss',
            },
          },
        ],
      },
      {
        name: 'ExternalLink',
        path: 'external-link',
        meta: {
          icon: 'mdi:newspaper-variant-multiple-outline',
          title: $t('page.outside.external-link'),
        },
        redirect: '/outside/external-link/vite',
        children: [
          {
            name: 'Vite',
            path: 'vite',
            component: IFrameView,
            meta: {
              icon: 'logos:vitejs',
              link: 'https://vitejs.dev/',
              title: 'Vite',
            },
          },
          {
            name: 'VueUse',
            path: 'vue-use',
            component: IFrameView,
            meta: {
              icon: 'logos:vueuse',
              link: 'https://vueuse.org',
              title: 'VueUse',
            },
          },
        ],
      },
    ],
  },
];

export default routes;

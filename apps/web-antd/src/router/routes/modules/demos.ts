import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('page.demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    redirect: '/demos/access',
    children: [
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: $t('page.demos.access.frontendPermissions'),
        },
        name: 'Access',
        path: 'access',
        redirect: '/demos/access/page-control',
        children: [
          {
            name: 'AccessPageControl',
            path: 'page-control',
            component: () => import('#/views/demos/access/index.vue'),
            meta: {
              icon: 'mdi:page-previous-outline',
              title: $t('page.demos.access.pageAccess'),
            },
          },
          {
            name: 'AccessButtonControl',
            path: 'button-control',
            component: () => import('#/views/demos/access/button-control.vue'),
            meta: {
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.buttonControl'),
            },
          },
          {
            name: 'AccessMenuVisible403',
            path: 'menu-visible-403',
            component: () =>
              import('#/views/demos/access/menu-visible-403.vue'),
            meta: {
              authority: ['no-body'],
              icon: 'mdi:button-cursor',
              menuVisibleWithForbidden: true,
              title: $t('page.demos.access.menuVisible403'),
            },
          },
          {
            name: 'AccessSuperVisible',
            path: 'super-visible',
            component: () => import('#/views/demos/access/super-visible.vue'),
            meta: {
              authority: ['super'],
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.superVisible'),
            },
          },
          {
            name: 'AccessAdminVisible',
            path: 'admin-visible',
            component: () => import('#/views/demos/access/admin-visible.vue'),
            meta: {
              authority: ['admin'],
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.adminVisible'),
            },
          },
          {
            name: 'AccessUserVisible',
            path: 'user-visible',
            component: () => import('#/views/demos/access/user-visible.vue'),
            meta: {
              authority: ['user'],
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.userVisible'),
            },
          },
        ],
      },
      {
        meta: {
          icon: 'mdi:feature-highlight',
          title: $t('page.demos.features.title'),
        },
        name: 'Features',
        path: 'features',
        redirect: '/demos/features/hide-menu-children',
        children: [
          {
            name: 'HideChildrenInMenuParent',
            path: 'hide-children-in-menu',
            component: () =>
              import('#/views/demos/features/hide-menu-children/parent.vue'),
            meta: {
              hideChildrenInMenu: true,
              icon: 'ic:round-menu',
              title: 'page.demos.features.hideChildrenInMenu',
            },
            children: [
              {
                name: 'HideChildrenInMenuChildren',
                path: 'hide-children-in-menu',
                component: () =>
                  import(
                    '#/views/demos/features/hide-menu-children/children.vue'
                  ),
              },
            ],
          },
          {
            name: 'LoginExpired',
            path: 'login-expired',
            component: () =>
              import('#/views/demos/features/login-expired/index.vue'),
            meta: {
              icon: 'mdi:encryption-expiration',
              title: $t('page.demos.features.loginExpired'),
            },
          },
        ],
      },
      {
        meta: {
          icon: 'mdi:lightbulb-error-outline',
          title: $t('page.demos.fallback.title'),
        },
        name: 'Fallback',
        path: 'fallback',
        redirect: '/demos/fallback/403',
        children: [
          {
            name: 'Fallback403',
            path: '403',
            component: () => import('#/views/_core/fallback/forbidden.vue'),
            meta: {
              icon: 'mdi:do-not-disturb-alt',
              title: '403',
            },
          },
          {
            name: 'Fallback404',
            path: '404',
            component: () => import('#/views/_core/fallback/not-found.vue'),
            meta: {
              icon: 'mdi:table-off',
              title: '404',
            },
          },
          {
            name: 'Fallback500',
            path: '500',
            component: () =>
              import('#/views/_core/fallback/internal-error.vue'),
            meta: {
              icon: 'mdi:server-network-off',
              title: '500',
            },
          },
          {
            name: 'FallbackOffline',
            path: 'offline',
            component: () => import('#/views/_core/fallback/offline.vue'),
            meta: {
              icon: 'mdi:offline',
              title: $t('fallback.offline'),
            },
          },
        ],
      },
      {
        meta: {
          icon: 'ic:round-settings-input-composite',
          title: $t('page.demos.outside.title'),
        },
        name: 'Outside',
        path: 'outside',
        redirect: '/demos/outside/iframe',
        children: [
          {
            name: 'iframe',
            path: 'iframe',
            meta: {
              icon: 'mdi:newspaper-variant-outline',
              title: $t('page.demos.outside.embedded'),
            },
            redirect: '/demos/outside/iframe/vue-document',
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
              title: $t('page.demos.outside.externalLink'),
            },
            redirect: '/demos/outside/external-link/vite',
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
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('page.demos.nested.title'),
        },
        name: 'Nested',
        path: 'nested',
        redirect: '/demos/nested/menu1',
        children: [
          {
            name: 'Menu1',
            path: 'menu1',
            component: () => import('#/views/demos/nested/menu-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('page.demos.nested.menu1'),
            },
          },
          {
            name: 'Menu2',
            path: 'menu2',
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('page.demos.nested.menu2'),
            },
            redirect: '/demos/nested/menu2/menu2-1',
            children: [
              {
                name: 'Menu21',
                path: 'menu2-1',
                component: () => import('#/views/demos/nested/menu-2-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('page.demos.nested.menu2_1'),
                },
              },
            ],
          },
          {
            name: 'Menu3',
            path: 'menu3',
            meta: {
              icon: 'ic:round-menu',
              title: $t('page.demos.nested.menu3'),
            },
            redirect: '/demos/nested/menu3/menu3-1',
            children: [
              {
                name: 'Menu31',
                path: 'menu3-1',
                component: () => import('#/views/demos/nested/menu-3-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('page.demos.nested.menu3_1'),
                },
              },
              {
                name: 'Menu32',
                path: 'menu3-2',
                meta: {
                  icon: 'ic:round-menu',
                  title: $t('page.demos.nested.menu3_2'),
                },
                redirect: '/demos/nested/menu3/menu3-2/menu3-2-1',
                children: [
                  {
                    name: 'Menu321',
                    path: 'menu3-2-1',
                    component: () =>
                      import('#/views/demos/nested/menu-3-2-1.vue'),
                    meta: {
                      icon: 'ic:round-menu',
                      keepAlive: true,
                      title: $t('page.demos.nested.menu3_2_1'),
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;

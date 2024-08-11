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
    children: [
      // 权限控制
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: $t('page.demos.access.frontendPermissions'),
        },
        name: 'AccessDemos',
        path: '/demos/access',
        children: [
          {
            name: 'AccessPageControlDemo',
            path: '/demos/access/page-control',
            component: () => import('#/views/demos/access/index.vue'),
            meta: {
              icon: 'mdi:page-previous-outline',
              title: $t('page.demos.access.pageAccess'),
            },
          },
          {
            name: 'AccessButtonControlDemo',
            path: '/demos/access/button-control',
            component: () => import('#/views/demos/access/button-control.vue'),
            meta: {
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.buttonControl'),
            },
          },
          {
            name: 'AccessMenuVisible403Demo',
            path: '/demos/access/menu-visible-403',
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
            name: 'AccessSuperVisibleDemo',
            path: '/demos/access/super-visible',
            component: () => import('#/views/demos/access/super-visible.vue'),
            meta: {
              authority: ['super'],
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.superVisible'),
            },
          },
          {
            name: 'AccessAdminVisibleDemo',
            path: '/demos/access/admin-visible',
            component: () => import('#/views/demos/access/admin-visible.vue'),
            meta: {
              authority: ['admin'],
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.adminVisible'),
            },
          },
          {
            name: 'AccessUserVisibleDemo',
            path: '/demos/access/user-visible',
            component: () => import('#/views/demos/access/user-visible.vue'),
            meta: {
              authority: ['user'],
              icon: 'mdi:button-cursor',
              title: $t('page.demos.access.userVisible'),
            },
          },
        ],
      },
      // 功能
      {
        meta: {
          icon: 'mdi:feature-highlight',
          title: $t('page.demos.features.title'),
        },
        name: 'FeaturesDemos',
        path: '/demos/features',
        children: [
          {
            name: 'LoginExpiredDemo',
            path: '/demos/features/login-expired',
            component: () =>
              import('#/views/demos/features/login-expired/index.vue'),
            meta: {
              icon: 'mdi:encryption-expiration',
              title: $t('page.demos.features.loginExpired'),
            },
          },
          {
            name: 'IconsDemo',
            path: '/demos/features/icons',
            component: () => import('#/views/demos/features/icons/index.vue'),
            meta: {
              title: $t('page.demos.features.icons'),
            },
          },
          {
            name: 'WatermarkDemo',
            path: '/demos/features/watermark',
            component: () =>
              import('#/views/demos/features/watermark/index.vue'),
            meta: {
              title: $t('page.demos.features.watermark'),
            },
          },
          {
            name: 'FeatureTabsDemo',
            path: '/demos/features/tabs',
            component: () => import('#/views/demos/features/tabs/index.vue'),
            meta: {
              icon: 'lucide:app-window',
              title: $t('page.demos.features.tabs'),
            },
          },
          {
            name: 'FeatureTabDetailDemo',
            path: '/demos/features/tabs/detail/:id',
            component: () =>
              import('#/views/demos/features/tabs/tab-detail.vue'),
            meta: {
              activePath: '/demos/features/tabs',
              hideInMenu: true,
              maxNumOfOpenTab: 3,
              title: $t('page.demos.features.tabDetail'),
            },
          },
          {
            name: 'HideChildrenInMenuParentDemo',
            path: '/demos/features/hide-menu-children',
            component: () =>
              import('#/views/demos/features/hide-menu-children/parent.vue'),
            meta: {
              hideChildrenInMenu: true,
              icon: 'ic:round-menu',
              title: $t('page.demos.features.hideChildrenInMenu'),
            },
            children: [
              {
                name: 'HideChildrenInMenuChildrenDemo',
                path: '/demos/features/hide-menu-children/children',
                component: () =>
                  import(
                    '#/views/demos/features/hide-menu-children/children.vue'
                  ),
                meta: { title: 'HideChildrenInMenuChildrenDemo' },
              },
            ],
          },
        ],
      },
      // 面包屑导航
      {
        name: 'BreadcrumbDemos',
        path: '/demos/breadcrumb',
        meta: {
          icon: 'lucide:navigation',
          title: $t('page.demos.breadcrumb.navigation'),
        },
        children: [
          {
            name: 'BreadcrumbLateralDemo',
            path: '/demos/breadcrumb/lateral',
            component: () => import('#/views/demos/breadcrumb/lateral.vue'),
            meta: {
              icon: 'lucide:navigation',
              title: $t('page.demos.breadcrumb.lateral'),
            },
          },
          {
            name: 'BreadcrumbLateralDetailDemo',
            path: '/demos/breadcrumb/lateral-detail',
            component: () =>
              import('#/views/demos/breadcrumb/lateral-detail.vue'),
            meta: {
              activePath: '/demos/breadcrumb/lateral',
              hideInMenu: true,
              title: $t('page.demos.breadcrumb.lateralDetail'),
            },
          },
          {
            name: 'BreadcrumbLevelDemo',
            path: '/demos/breadcrumb/level',
            meta: {
              icon: 'lucide:navigation',
              title: $t('page.demos.breadcrumb.level'),
            },
            children: [
              {
                name: 'BreadcrumbLevelDetailDemo',
                path: '/demos/breadcrumb/level/detail',
                component: () =>
                  import('#/views/demos/breadcrumb/level-detail.vue'),
                meta: {
                  title: $t('page.demos.breadcrumb.levelDetail'),
                },
              },
            ],
          },
        ],
      },
      // 缺省页
      {
        meta: {
          icon: 'mdi:lightbulb-error-outline',
          title: $t('page.demos.fallback.title'),
        },
        name: 'FallbackDemos',
        path: '/demos/fallback',
        children: [
          {
            name: 'Fallback403Demo',
            path: '/demos/fallback/403',
            component: () => import('#/views/_core/fallback/forbidden.vue'),
            meta: {
              icon: 'mdi:do-not-disturb-alt',
              title: '403',
            },
          },
          {
            name: 'Fallback404Demo',
            path: '/demos/fallback/404',
            component: () => import('#/views/_core/fallback/not-found.vue'),
            meta: {
              icon: 'mdi:table-off',
              title: '404',
            },
          },
          {
            name: 'Fallback500Demo',
            path: '/demos/fallback/500',
            component: () =>
              import('#/views/_core/fallback/internal-error.vue'),
            meta: {
              icon: 'mdi:server-network-off',
              title: '500',
            },
          },
          {
            name: 'FallbackOfflineDemo',
            path: '/demos/fallback/offline',
            component: () => import('#/views/_core/fallback/offline.vue'),
            meta: {
              icon: 'mdi:offline',
              title: $t('fallback.offline'),
            },
          },
        ],
      },
      // 菜单徽标
      {
        meta: {
          badgeType: 'dot',
          badgeVariants: 'destructive',
          icon: 'lucide:circle-dot',
          title: $t('page.demos.badge.title'),
        },
        name: 'BadgeDemos',
        path: '/demos/badge',
        children: [
          {
            name: 'BadgeDotDemo',
            component: () => import('#/views/demos/badge/index.vue'),
            path: '/demos/badge/dot',
            meta: {
              badgeType: 'dot',
              icon: 'lucide:square-dot',
              title: $t('page.demos.badge.dot'),
            },
          },
          {
            name: 'BadgeTextDemo',
            component: () => import('#/views/demos/badge/index.vue'),
            path: '/demos/badge/text',
            meta: {
              badge: '10',
              icon: 'lucide:square-dot',
              title: $t('page.demos.badge.text'),
            },
          },
          {
            name: 'BadgeColorDemo',
            component: () => import('#/views/demos/badge/index.vue'),
            path: '/demos/badge/color',
            meta: {
              badge: 'Hot',
              badgeVariants: 'destructive',
              icon: 'lucide:square-dot',
              title: $t('page.demos.badge.color'),
            },
          },
        ],
      },
      // 菜单激活图标
      {
        meta: {
          activeIcon: 'fluent-emoji:radioactive',
          icon: 'bi:radioactive',
          title: $t('page.demos.activeIcon.title'),
        },
        name: 'ActiveIconDemos',
        path: '/demos/active-icon',
        children: [
          {
            name: 'ActiveIconDemo',
            component: () => import('#/views/demos/active-icon/index.vue'),
            path: '/demos/active-icon/children',
            meta: {
              activeIcon: 'fluent-emoji:radioactive',
              icon: 'bi:radioactive',
              title: $t('page.demos.activeIcon.children'),
            },
          },
        ],
      },
      // 外部链接
      {
        meta: {
          icon: 'ic:round-settings-input-composite',
          title: $t('page.demos.outside.title'),
        },
        name: 'OutsideDemos',
        path: '/demos/outside',
        children: [
          {
            name: 'IframeDemos',
            path: '/demos/outside/iframe',
            meta: {
              icon: 'mdi:newspaper-variant-outline',
              title: $t('page.demos.outside.embedded'),
            },
            children: [
              {
                name: 'VueDocumentDemo',
                path: '/demos/outside/iframe/vue-document',
                component: IFrameView,
                meta: {
                  icon: 'logos:vue',
                  iframeSrc: 'https://cn.vuejs.org/',
                  keepAlive: true,
                  title: 'Vue',
                },
              },
              {
                name: 'TailwindcssDemo',
                path: '/demos/outside/iframe/tailwindcss',
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
            name: 'ExternalLinkDemos',
            path: '/demos/outside/external-link',
            meta: {
              icon: 'mdi:newspaper-variant-multiple-outline',
              title: $t('page.demos.outside.externalLink'),
            },
            children: [
              {
                name: 'ViteDemo',
                path: '/demos/outside/external-link/vite',
                component: IFrameView,
                meta: {
                  icon: 'logos:vitejs',
                  link: 'https://vitejs.dev/',
                  title: 'Vite',
                },
              },
              {
                name: 'VueUseDemo',
                path: '/demos/outside/external-link/vue-use',
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
      // 嵌套菜单
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('page.demos.nested.title'),
        },
        name: 'NestedDemos',
        path: '/demos/nested',
        children: [
          {
            name: 'Menu1Demo',
            path: '/demos/nested/menu1',
            component: () => import('#/views/demos/nested/menu-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('page.demos.nested.menu1'),
            },
          },
          {
            name: 'Menu2Demo',
            path: '/demos/nested/menu2',
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('page.demos.nested.menu2'),
            },
            children: [
              {
                name: 'Menu21Demo',
                path: '/demos/nested/menu2/menu2-1',
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
            name: 'Menu3Demo',
            path: '/demos/nested/menu3',
            meta: {
              icon: 'ic:round-menu',
              title: $t('page.demos.nested.menu3'),
            },
            children: [
              {
                name: 'Menu31Demo',
                path: 'menu3-1',
                component: () => import('#/views/demos/nested/menu-3-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('page.demos.nested.menu3_1'),
                },
              },
              {
                name: 'Menu32Demo',
                path: 'menu3-2',
                meta: {
                  icon: 'ic:round-menu',
                  title: $t('page.demos.nested.menu3_2'),
                },
                children: [
                  {
                    name: 'Menu321Demo',
                    path: '/demos/nested/menu3/menu3-2/menu3-2-1',
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

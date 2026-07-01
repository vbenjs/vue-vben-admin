import type { RouteRecordRaw } from 'vue-router';

import { IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      // 权限控制
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: $t('demos.access.frontendPermissions'),
        },
        name: 'AccessDemos',
        path: 'access',
        children: [
          {
            name: 'AccessPageControlDemo',
            path: 'page-control',
            component: () => import('#/views/demos/access/index.vue'),
            meta: {
              icon: 'mdi:page-previous-outline',
              title: $t('demos.access.pageAccess'),
              domCached: true,
            },
          },
          {
            name: 'AccessButtonControlDemo',
            path: 'button-control',
            component: () => import('#/views/demos/access/button-control.vue'),
            meta: {
              icon: 'mdi:button-cursor',
              title: $t('demos.access.buttonControl'),
            },
          },
          {
            name: 'AccessMenuVisible403Demo',
            path: 'menu-visible-403',
            component: () =>
              import('#/views/demos/access/menu-visible-403.vue'),
            meta: {
              authority: ['no-body'],
              icon: 'mdi:button-cursor',
              menuVisibleWithForbidden: true,
              title: $t('demos.access.menuVisible403'),
            },
          },
          {
            name: 'AccessSuperVisibleDemo',
            path: 'super-visible',
            component: () => import('#/views/demos/access/super-visible.vue'),
            meta: {
              authority: ['super'],
              icon: 'mdi:button-cursor',
              title: $t('demos.access.superVisible'),
            },
          },
          {
            name: 'AccessAdminVisibleDemo',
            path: 'admin-visible',
            component: () => import('#/views/demos/access/admin-visible.vue'),
            meta: {
              authority: ['admin'],
              icon: 'mdi:button-cursor',
              title: $t('demos.access.adminVisible'),
            },
          },
          {
            name: 'AccessUserVisibleDemo',
            path: 'user-visible',
            component: () => import('#/views/demos/access/user-visible.vue'),
            meta: {
              authority: ['user'],
              icon: 'mdi:button-cursor',
              title: $t('demos.access.userVisible'),
            },
          },
        ],
      },
      // 功能
      {
        meta: {
          icon: 'mdi:feature-highlight',
          title: $t('demos.features.title'),
        },
        name: 'FeaturesDemos',
        path: 'features',
        children: [
          {
            name: 'LoginExpiredDemo',
            path: 'login-expired',
            component: () =>
              import('#/views/demos/features/login-expired/index.vue'),
            meta: {
              icon: 'mdi:encryption-expiration',
              title: $t('demos.features.loginExpired'),
            },
          },
          {
            name: 'IconsDemo',
            path: 'icons',
            component: () => import('#/views/demos/features/icons/index.vue'),
            meta: {
              icon: 'lucide:annoyed',
              title: $t('demos.features.icons'),
            },
          },
          {
            name: 'WatermarkDemo',
            path: 'watermark',
            component: () =>
              import('#/views/demos/features/watermark/index.vue'),
            meta: {
              icon: 'lucide:tags',
              title: $t('demos.features.watermark'),
            },
          },
          {
            name: 'PreferencesExtensionDemo',
            path: 'preferences-extension',
            component: () =>
              import('#/views/demos/features/preferences-extension/index.vue'),
            meta: {
              icon: 'lucide:sliders-horizontal',
              title: $t('demos.features.preferencesExtension'),
            },
          },
          {
            name: 'FeatureTabsDemo',
            path: 'tabs',
            component: () => import('#/views/demos/features/tabs/index.vue'),
            meta: {
              icon: 'lucide:app-window',
              title: $t('demos.features.tabs'),
            },
          },
          {
            name: 'FeatureTabDetailDemo',
            path: 'detail/:id',
            component: () =>
              import('#/views/demos/features/tabs/tab-detail.vue'),
            meta: {
              activePath: '/demos/features/tabs',
              hideInMenu: true,
              maxNumOfOpenTab: 3,
              title: $t('demos.features.tabDetail'),
            },
          },
          {
            name: 'HideChildrenInMenuParentDemo',
            path: 'hide-menu-children',
            meta: {
              hideChildrenInMenu: true,
              icon: 'ic:round-menu',
              title: $t('demos.features.hideChildrenInMenu'),
            },
            children: [
              {
                name: 'HideChildrenInMenuDemo',
                path: '',
                component: () =>
                  import('#/views/demos/features/hide-menu-children/parent.vue'),
                meta: {
                  // hideInMenu: true,
                  title: $t('demos.features.hideChildrenInMenu'),
                },
              },
              {
                name: 'HideChildrenInMenuChildrenDemo',
                path: 'children',
                component: () =>
                  import('#/views/demos/features/hide-menu-children/children.vue'),
                meta: {
                  activePath: '/demos/features/hide-menu-children',
                  title: $t('demos.features.hideChildrenInMenu'),
                },
              },
            ],
          },
          {
            name: 'FullScreenDemo',
            path: 'full-screen',
            component: () =>
              import('#/views/demos/features/full-screen/index.vue'),
            meta: {
              icon: 'lucide:fullscreen',
              title: $t('demos.features.fullScreen'),
            },
          },
          {
            name: 'FileDownloadDemo',
            path: 'file-download',
            component: () =>
              import('#/views/demos/features/file-download/index.vue'),
            meta: {
              icon: 'lucide:hard-drive-download',
              title: $t('demos.features.fileDownload'),
            },
          },
          {
            name: 'ClipboardDemo',
            path: 'clipboard',
            component: () =>
              import('#/views/demos/features/clipboard/index.vue'),
            meta: {
              icon: 'lucide:copy',
              title: $t('demos.features.clipboard'),
            },
          },
          {
            name: 'MenuQueryDemo',
            path: 'menu-query',
            component: () =>
              import('#/views/demos/features/menu-query/index.vue'),
            meta: {
              icon: 'lucide:curly-braces',
              query: {
                id: 1,
              },
              title: $t('demos.features.menuWithQuery'),
            },
          },
          {
            name: 'NewWindowDemo',
            path: 'new-window',
            component: () =>
              import('#/views/demos/features/new-window/index.vue'),
            meta: {
              icon: 'lucide:app-window',
              openInNewWindow: true,
              title: $t('demos.features.openInNewWindow'),
            },
          },
          {
            name: 'VueQueryDemo',
            path: 'vue-query',
            component: () =>
              import('#/views/demos/features/vue-query/index.vue'),
            meta: {
              icon: 'lucide:git-pull-request-arrow',
              title: 'Tanstack Query',
            },
          },
          {
            name: 'RequestParamsSerializerDemo',
            path: 'request-params-serializer',
            component: () =>
              import('#/views/demos/features/request-params-serializer/index.vue'),
            meta: {
              icon: 'lucide:git-pull-request-arrow',
              title: $t('demos.features.requestParamsSerializer'),
            },
          },
          {
            name: 'BigIntDemo',
            path: 'json-bigint',
            component: () =>
              import('#/views/demos/features/json-bigint/index.vue'),
            meta: {
              icon: 'lucide:grape',
              title: 'JSON BigInt',
            },
          },
        ],
      },
      // 面包屑导航
      {
        name: 'BreadcrumbDemos',
        path: 'breadcrumb',
        meta: {
          icon: 'lucide:navigation',
          title: $t('demos.breadcrumb.navigation'),
        },
        children: [
          {
            name: 'BreadcrumbLateralDemo',
            path: 'lateral',
            component: () => import('#/views/demos/breadcrumb/lateral.vue'),
            meta: {
              icon: 'lucide:navigation',
              title: $t('demos.breadcrumb.lateral'),
            },
          },
          {
            name: 'BreadcrumbLateralDetailDemo',
            path: 'lateral-detail',
            component: () =>
              import('#/views/demos/breadcrumb/lateral-detail.vue'),
            meta: {
              activePath: '/demos/breadcrumb/lateral',
              hideInMenu: true,
              title: $t('demos.breadcrumb.lateralDetail'),
            },
          },
          {
            name: 'BreadcrumbLevelDemo',
            path: 'level',
            meta: {
              icon: 'lucide:navigation',
              title: $t('demos.breadcrumb.level'),
            },
            children: [
              {
                name: 'BreadcrumbLevelDetailDemo',
                path: 'detail',
                component: () =>
                  import('#/views/demos/breadcrumb/level-detail.vue'),
                meta: {
                  title: $t('demos.breadcrumb.levelDetail'),
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
          title: $t('demos.fallback.title'),
        },
        name: 'FallbackDemos',
        path: 'fallback',
        children: [
          {
            name: 'Fallback403Demo',
            path: '403',
            component: () => import('#/views/_core/fallback/forbidden.vue'),
            meta: {
              icon: 'mdi:do-not-disturb-alt',
              title: '403',
            },
          },
          {
            name: 'Fallback404Demo',
            path: '404',
            component: () => import('#/views/_core/fallback/not-found.vue'),
            meta: {
              icon: 'mdi:table-off',
              title: '404',
            },
          },
          {
            name: 'Fallback500Demo',
            path: '500',
            component: () =>
              import('#/views/_core/fallback/internal-error.vue'),
            meta: {
              icon: 'mdi:server-network-off',
              title: '500',
            },
          },
          {
            name: 'FallbackOfflineDemo',
            path: 'offline',
            component: () => import('#/views/_core/fallback/offline.vue'),
            meta: {
              icon: 'mdi:offline',
              title: $t('ui.fallback.offline'),
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
          title: $t('demos.badge.title'),
        },
        name: 'BadgeDemos',
        path: 'badge',
        children: [
          {
            name: 'BadgeDotDemo',
            component: () => import('#/views/demos/badge/index.vue'),
            path: 'dot',
            meta: {
              badgeType: 'dot',
              icon: 'lucide:square-dot',
              title: $t('demos.badge.dot'),
            },
          },
          {
            name: 'BadgeTextDemo',
            component: () => import('#/views/demos/badge/index.vue'),
            path: 'text',
            meta: {
              badge: '10',
              icon: 'lucide:square-dot',
              title: $t('demos.badge.text'),
            },
          },
          {
            name: 'BadgeColorDemo',
            component: () => import('#/views/demos/badge/index.vue'),
            path: 'color',
            meta: {
              badge: 'Hot',
              badgeVariants: 'destructive',
              icon: 'lucide:square-dot',
              title: $t('demos.badge.color'),
            },
          },
        ],
      },
      // 菜单激活图标
      {
        meta: {
          activeIcon: 'fluent-emoji:radioactive',
          icon: 'bi:radioactive',
          title: $t('demos.activeIcon.title'),
        },
        name: 'ActiveIconDemos',
        path: 'active-icon',
        children: [
          {
            name: 'ActiveIconDemo',
            component: () => import('#/views/demos/active-icon/index.vue'),
            path: 'children',
            meta: {
              activeIcon: 'fluent-emoji:radioactive',
              icon: 'bi:radioactive',
              title: $t('demos.activeIcon.children'),
            },
          },
        ],
      },
      // 外部链接
      {
        meta: {
          icon: 'ic:round-settings-input-composite',
          title: $t('demos.outside.title'),
        },
        name: 'OutsideDemos',
        path: 'outside',
        children: [
          {
            name: 'IframeDemos',
            path: 'iframe',
            meta: {
              icon: 'mdi:newspaper-variant-outline',
              title: $t('demos.outside.embedded'),
            },
            children: [
              {
                name: 'VueDocumentDemo',
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
                name: 'TailwindcssDemo',
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
            name: 'ExternalLinkDemos',
            path: 'external-link',
            meta: {
              icon: 'mdi:newspaper-variant-multiple-outline',
              title: $t('demos.outside.externalLink'),
            },
            children: [
              {
                name: 'ViteDemo',
                path: 'vite',
                component: IFrameView,
                meta: {
                  icon: 'logos:vitejs',
                  link: 'https://vitejs.dev/',
                  title: 'Vite',
                },
              },
              {
                name: 'VueUseDemo',
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
      // 嵌套菜单
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('demos.nested.title'),
        },
        name: 'NestedDemos',
        path: 'nested',
        children: [
          {
            name: 'Menu1Demo',
            path: 'menu1',
            component: () => import('#/views/demos/nested/menu-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('demos.nested.menu1'),
            },
          },
          {
            name: 'Menu2Demo',
            path: 'menu2',
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('demos.nested.menu2'),
            },
            children: [
              {
                name: 'Menu21Demo',
                path: 'menu2-1',
                component: () => import('#/views/demos/nested/menu-2-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('demos.nested.menu2_1'),
                },
              },
            ],
          },
          {
            name: 'Menu3Demo',
            path: 'menu3',
            meta: {
              icon: 'ic:round-menu',
              title: $t('demos.nested.menu3'),
            },
            children: [
              {
                name: 'Menu31Demo',
                path: 'menu3-1',
                component: () => import('#/views/demos/nested/menu-3-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('demos.nested.menu3_1'),
                },
              },
              {
                name: 'Menu32Demo',
                path: 'menu3-2',
                meta: {
                  icon: 'ic:round-menu',
                  title: $t('demos.nested.menu3_2'),
                },
                children: [
                  {
                    name: 'Menu321Demo',
                    path: 'menu3-2-1',
                    component: () =>
                      import('#/views/demos/nested/menu-3-2-1.vue'),
                    meta: {
                      icon: 'ic:round-menu',
                      keepAlive: true,
                      title: $t('demos.nested.menu3_2_1'),
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

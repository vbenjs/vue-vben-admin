---
outline: deep
---

# Routing and Menus

In the project, the framework provides a basic routing system and **automatically generates the corresponding menu structure based on the routing file**.

## Route Types

Routes are divided into static routes and dynamic routes. Static routes are routes that have been determined when the project starts. Dynamic routes are generally routes that are dynamically generated based on the user's permissions after the user logs in.

### Static Routes

If your page project does not require permission control, you can directly use static routes. The configuration of static routes is in the `src/router/routes/index` directory under the application. Open the commented file content:

```ts
// If necessary, you can open your own comments and create folders
// const externalRouteFiles = import.meta.glob('./external/**/*.ts', { eager: true }); // [!code --]
const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true }); // [!code ++]
/** Dynamic routing */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/** External routing lists, which can be accessed without Layout, may be used for embedding in other systems */
// const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles) // [!code --]
const externalRoutes: RouteRecordRaw[] = []; // [!code --]
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles); // [!code ++]
```

### Dynamic routing

The configuration of dynamic routing is in the corresponding application `src/router/routes/modules` directory. All routing files are stored in this directory. The content format of each file is as follows, which is consistent with the routing configuration format of Vue Router. The following is the configuration of secondary routes and multi-level routes.

## Define the route

Static routes and dynamic routes are configured in the same way. The configuration of the level-2 and multi-level routes is as follows:

### Secondary route

::: details Example code of the secondary route

```ts
import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
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
        path: '/vben-admin/about',
        component: () => import('#/views/_core/about/index.vue'),
        meta: {
          badgeType: 'dot',
          badgeVariants: 'destructive',
          icon: 'lucide:copyright',
          title: $t('page.vben.about'),
        },
      },
    ],
  },
];

export default routes;
```

:::

### Multilevel routing

::: tip

- The parent route of multi-level routing does not need to set the 'component' attribute, only the 'children' attribute needs to be set. Unless you really need to display content under nested parent routing.

- If there are no special circumstances, the 'redirect' attribute of the parent route does not need to be specified and will default to the first child route.

:::

::: details Multilevel Routing Example Code

```ts
import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    redirect: '/demos/access',
    children: [
      // 嵌套菜单
      {
        meta: {
          icon: 'ic:round-menu',
          title: $t('demos.nested.title'),
        },
        name: 'NestedDemos',
        path: '/demos/nested',
        redirect: '/demos/nested/menu1',
        children: [
          {
            name: 'Menu1Demo',
            path: '/demos/nested/menu1',
            component: () => import('#/views/demos/nested/menu-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('demos.nested.menu1'),
            },
          },
          {
            name: 'Menu2Demo',
            path: '/demos/nested/menu2',
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('demos.nested.menu2'),
            },
            redirect: '/demos/nested/menu2/menu2-1',
            children: [
              {
                name: 'Menu21Demo',
                path: '/demos/nested/menu2/menu2-1',
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
            path: '/demos/nested/menu3',
            meta: {
              icon: 'ic:round-menu',
              title: $t('demos.nested.menu3'),
            },
            redirect: '/demos/nested/menu3/menu3-1',
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
                redirect: '/demos/nested/menu3/menu3-2/menu3-2-1',
                children: [
                  {
                    name: 'Menu321Demo',
                    path: '/demos/nested/menu3/menu3-2/menu3-2-1',
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
```

:::

## Add a New Page

To add a new page, you only need to add a route and the corresponding page component.

### Add a Route

Add a route object in the corresponding routing file as follows:

```ts
import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:home',
      title: $t('page.home.title'),
    },
    name: 'Home',
    path: '/home',
    redirect: '/home/index',
    children: [
      {
        name: 'HomeIndex',
        path: '/home/index',
        component: () => import('#/views/home/index.vue'),
        meta: {
          icon: 'mdi:home',
          title: $t('page.home.index'),
        },
      },
    ],
  },
];

export default routes;
```

### Add Page Component

In `#/views/home/`, add a new `index.vue` file as follows:

```vue
<template>
  <div>
    <h1>home page</h1>
  </div>
</template>
```

### Verification

At this point, the page has been added. Access `http://localhost:5555/home/index` to see the corresponding page.

## Route Configuration

The route configuration mainly resides in the `meta` attribute of the route object. Below are some commonly used configuration items：

```ts {5-8}
const routes = [
  {
    name: 'HomeIndex',
    path: '/home/index',
    meta: {
      icon: 'mdi:home',
      title: $t('page.home.index'),
    },
  },
];
```

::: details Route Meta Configuration Type Definition

```ts
interface RouteMeta {
  /**
   * Active icon (menu)
   */
  activeIcon?: string;
  /**
   * The currently active menu, used when you want to activate a parent menu instead of the existing one
   * @default false
   */
  activePath?: string;
  /**
   * Whether to affix the tab
   * @default false
   */
  affixTab?: boolean;
  /**
   * The order of the affixed tab
   * @default 0
   */
  affixTabOrder?: number;
  /**
   * Specific role identifiers required for access
   * @default []
   */
  authority?: string[];
  /**
   * Badge
   */
  badge?: string;
  /**
   * Badge type
   */
  badgeType?: 'dot' | 'normal';
  /**
   * Badge color
   */
  badgeVariants?:
    | 'default'
    | 'destructive'
    | 'primary'
    | 'success'
    | 'warning'
    | string;
  /**
   * Children of the current route do not show in the menu
   * @default false
   */
  hideChildrenInMenu?: boolean;
  /**
   * The current route does not show in the breadcrumb
   * @default false
   */
  hideInBreadcrumb?: boolean;
  /**
   * The current route does not show in the menu
   * @default false
   */
  hideInMenu?: boolean;
  /**
   * The current route does not show in tabs
   * @default false
   */
  hideInTab?: boolean;
  /**
   * Icon (menu/tab)
   */
  icon?: string;
  /**
   * iframe address
   */
  iframeSrc?: string;
  /**
   * Ignore access, can be accessed directly
   * @default false
   */
  ignoreAccess?: boolean;
  /**
   * Enable KeepAlive caching
   */
  keepAlive?: boolean;
  /**
   * External link - redirect path
   */
  link?: string;
  /**
   * Whether the route has been loaded
   */
  loaded?: boolean;
  /**
   * Maximum number of open tabs
   * @default false
   */
  maxNumOfOpenTab?: number;
  /**
   * The menu is visible, but access will be redirected to 403
   */
  menuVisibleWithForbidden?: boolean;
  /**
   * Used for route->menu sorting
   */
  order?: number;
  /**
   * Title name
   */
  title: string;
}
```

:::

### title

- Type: `string`
- Default value: `''`

Used to configure the page title, which will be displayed in the menu and tabs. It is generally used in conjunction with internationalization.

### icon

- Type: `string`
- Default value: `''`

Used to configure the page icon, which will be displayed in the menu and tabs. It is generally used in conjunction with an icon library. If it is an `http` link, the image will be automatically loaded.

### activeIcon

- Type: `string`
- Default value: `''`

Used to configure the active icon of the page, which will be displayed in the menu. It is generally used in conjunction with an icon library. If it is an `http` link, the image will be automatically loaded.

### keepAlive

- Type: `boolean`
- Default value: `false`

Used to configure whether the page caching is enabled. Once enabled, the page will be cached and not reloaded, only effective when tabs are enabled.

### hideInMenu

- Type: `boolean`
- Default value: `false`

Used to configure whether the page is hidden in the menu. If hidden, the page will not be displayed in the menu.

### hideInTab

- Type: `boolean`
- Default value: `false`

Used to configure whether the page is hidden in tabs. If hidden, the page will not be displayed in tabs.

### hideInBreadcrumb

- Type: `boolean`
- Default value: `false`

Used to configure whether the page is hidden in the breadcrumb. If hidden, the page will not be displayed in the breadcrumb.

### hideChildrenInMenu

- Type: `boolean`
- Default value: `false`

Used to configure whether the child pages of the page are hidden in the menu. If hidden, the child pages will not be displayed in the menu.

### authority

- Type: `string[]`
- Default value: `[]`

Used to configure the page's permissions. Only users with corresponding permissions can access the page. If not configured, no permissions are required.

### badge

- Type: `string`
- Default value: `''`

Used to configure the page's badge, which will be displayed in the menu.

### badgeType

- Type: `'dot' | 'normal'`
- Default value: `'normal'`

Used to configure the type of the page's badge. `dot` is a small red dot, `normal` is text.

### badgeVariants

- Type: `'default' | 'destructive' | 'primary' | 'success' | 'warning' | string`
- Default value: `'success'`

Used to configure the color of the page's badge.

### activePath

- Type: `string`
- Default value: `''`

Used to configure the currently active menu. Sometimes when the page is not displayed in the menu, it is used to activate the parent menu.

### affixTab

- Type: `boolean`
- Default value: `false`

Used to configure whether the page tab is pinned. Once pinned, the page cannot be closed.

### affixTabOrder

- Type: `number`
- Default value: `0`

Used to configure the order of the pinned page tabs, sorted in ascending order.

### iframeSrc

- Type: `string`
- Default value: `''`

Used to configure the `iframe` address of the embedded page. Once set, the corresponding page will be embedded in the current page.

### ignoreAccess

- Type: `boolean`
- Default value: `false`

Used to configure whether the page ignores permissions and can be accessed directly.

### link

- Type: `string`
- Default value: `''`

Used to configure the external link jump path, which will be opened in a new window.

### maxNumOfOpenTab

- Type: `number`
- Default value: `-1`

Used to configure the maximum number of open tabs. Once set, the earliest opened tab will be automatically closed when a new tab is opened (only effective when opening tabs with the same name).

### menuVisibleWithForbidden

- Type: `boolean`
- Default value: `false`

Used to configure whether the page can be seen in the menu, but access will be redirected to 403.

### order

- Type: `number`
- Default value: `0`

Used to configure the page's order, for routing to menu sorting.

## Route Refresh

The way to refresh the route is as follows:

```vue
<script setup lang="ts">
import { useRefresh } from '@vben/hooks';

const { refresh } = useRefresh();

// Refresh the current route
refresh();
</script>
```

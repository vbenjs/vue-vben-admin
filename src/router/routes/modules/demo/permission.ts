import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

export default {
  layout: {
    path: '/permission',
    name: 'Permission',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/permission/front',
    meta: {
      icon: 'carbon:user-role',
      title: '权限管理',
    },
  },

  routes: [
    {
      path: '/front',
      name: 'PermissionFrontDemo',
      meta: {
        title: '基于前端权限',
      },
      children: [
        {
          path: 'page',
          component: () => import('/@/views/demo/permission/front/index.vue'),
          meta: {
            title: '页面权限',
          },
        },
        {
          path: 'btn',
          component: () => import('/@/views/demo/permission/front/Btn.vue'),
          meta: {
            title: '按钮权限',
          },
        },
        {
          path: 'auth-pageA',
          component: () => import('/@/views/demo/permission/front/AuthPageA.vue'),
          meta: {
            title: '权限测试页A',
            roles: [RoleEnum.SUPER],
          },
        },
        {
          path: 'auth-pageB',
          component: () => import('/@/views/demo/permission/front/AuthPageB.vue'),
          meta: {
            title: '权限测试页B',
            roles: [RoleEnum.TEST],
          },
        },
      ],
    },
    {
      path: '/back',
      name: 'PermissionBackDemo',
      meta: {
        title: '基于后台权限',
      },
      children: [
        {
          path: 'page',
          component: () => import('/@/views/demo/permission/back/index.vue'),
          meta: {
            title: '页面权限',
          },
        },
        {
          path: 'btn',
          component: () => import('/@/views/demo/permission/back/Btn.vue'),
          meta: {
            title: '按钮权限',
          },
        },
      ],
    },
  ],
} as AppRouteModule;

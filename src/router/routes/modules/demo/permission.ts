import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const permission: AppRouteModule = {
  layout: {
    path: '/permission',
    name: 'Permission',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/permission/front/page',
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
          name: 'FrontPageAuth',
          component: () => import('/@/views/demo/permission/front/index.vue'),
          meta: {
            title: '页面权限',
          },
        },
        {
          path: 'btn',
          name: 'FrontBtnAuth',
          component: () => import('/@/views/demo/permission/front/Btn.vue'),
          meta: {
            title: '按钮权限',
          },
        },
        {
          path: 'auth-pageA',
          name: 'FrontAuthPageA',
          component: () => import('/@/views/demo/permission/front/AuthPageA.vue'),
          meta: {
            title: '权限测试页A',
            roles: [RoleEnum.SUPER],
          },
        },
        {
          path: 'auth-pageB',
          name: 'FrontAuthPageB',
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
          name: 'BackAuthPage',
          component: () => import('/@/views/demo/permission/back/index.vue'),
          meta: {
            title: '页面权限',
          },
        },
        {
          path: 'btn',
          name: 'BackAuthBtn',
          component: () => import('/@/views/demo/permission/back/Btn.vue'),
          meta: {
            title: '按钮权限',
          },
        },
      ],
    },
  ],
};

export default permission;

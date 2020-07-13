import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';
import { RoleEnum } from '@/enums/roleEnum';

const prefix = '/auth';

const layout: LayoutType = {
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '权限测试页',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/adminRole',
    name: 'RoleAdminAuth',
    component: () => createAsyncComponent(import('@/views/dashboard/welcome/index.vue')),
    meta: {
      title: '管理员可见',
      roles: [RoleEnum.ADMIN],
    },
    children: [
      {
        path: '/test1',
        name: 'RoleAdminAuth1',
        component: () => createAsyncComponent(import('@/views/dashboard/welcome/index.vue')),
        meta: {
          title: '测试1',
        },
      },
      {
        path: '/test2',
        name: 'RoleAdminAuth2',
        component: () => createAsyncComponent(import('@/views/dashboard/welcome/index.vue')),
        meta: {
          title: '测试2',
        },
      },
    ],
  },
  {
    path: '/normalRole',
    name: 'RoleNormalAuth',
    component: () => createAsyncComponent(import('@/views/dashboard/welcome/index.vue')),
    meta: {
      title: '普通用户可见',
      roles: [RoleEnum.NORMAL],
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;

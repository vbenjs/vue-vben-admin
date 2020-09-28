import { resultSuccess } from '../_util';
import { MockMethod } from 'vite-plugin-mock';

const dashboardRoute = {
  layout: {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'PAGE_LAYOUT',
    redirect: '/dashboard/welcome',
    meta: {
      icon: 'ant-design:home-outlined',
      title: 'Dashboard',
    },
  },
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: '/dashboard/welcome/index.vue',
      meta: {
        title: '欢迎页',
        affix: true,
      },
    },
  ],
};

const frontRoute = {
  path: '/front',
  name: 'PermissionFrontDemo',
  meta: {
    title: '基于前端权限',
  },
  children: [
    {
      path: 'page',
      component: '/demo/permission/front/index.vue',
      meta: {
        title: '页面权限',
      },
    },
    {
      path: 'btn',
      component: '/demo/permission/front/Btn.vue',
      meta: {
        title: '按钮权限',
      },
    },
    {
      path: 'auth-pageA',
      component: '/demo/permission/front/AuthPageA.vue',
      meta: {
        title: '权限测试页A',
      },
    },
    {
      path: 'auth-pageB',
      component: '/demo/permission/front/AuthPageB.vue',
      meta: {
        title: '权限测试页B',
      },
    },
  ],
};
const backRoute = {
  path: '/back',
  name: 'PermissionBackDemo',
  meta: {
    title: '基于后台权限',
  },
  children: [
    {
      path: 'page',
      component: 'demo/permission/back/index.vue',
      meta: {
        title: '页面权限',
      },
    },
    {
      path: 'btn',
      component: '/demo/permission/back/Btn.vue',
      meta: {
        title: '按钮权限',
      },
    },
  ],
};
const authRoute = {
  layout: {
    path: '/permission',
    name: 'Permission',
    component: 'PAGE_LAYOUT',
    redirect: '/permission/front/page',
    meta: {
      icon: 'ant-design:home-outlined',
      title: '权限管理',
    },
  },

  routes: [frontRoute, backRoute],
};

const authRoute1 = {
  layout: {
    path: '/permission',
    name: 'Permission',
    component: 'PAGE_LAYOUT',
    redirect: '/permission/front/page',
    meta: {
      icon: 'ant-design:home-outlined',
      title: '权限管理',
    },
  },

  routes: [backRoute],
};
export default [
  {
    url: '/api/getMenuListById',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { id } = query;
      if (!id || id === '1') {
        return resultSuccess([dashboardRoute, authRoute]);
      }
      if (id === '2') {
        return resultSuccess([dashboardRoute, authRoute1]);
      }
    },
  },
] as MockMethod[];

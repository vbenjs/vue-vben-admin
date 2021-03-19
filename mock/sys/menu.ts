import { resultSuccess } from '../_util';
import { MockMethod } from 'vite-plugin-mock';

// single
const dashboardRoute = {
  path: '/home',
  name: 'Home',
  component: '/dashboard/welcome/index',
  meta: {
    title: 'routes.dashboard.welcome',
    affix: true,
    icon: 'bx:bx-home',
  },
};

const frontRoute = {
  path: 'front',
  name: 'PermissionFrontDemo',
  meta: {
    title: 'routes.demo.permission.front',
  },
  children: [
    {
      path: 'page',
      name: 'FrontPageAuth',
      component: '/demo/permission/front/index',
      meta: {
        title: 'routes.demo.permission.frontPage',
      },
    },
    {
      path: 'btn',
      name: 'FrontBtnAuth',
      component: '/demo/permission/front/Btn',
      meta: {
        title: 'routes.demo.permission.frontBtn',
      },
    },
    {
      path: 'auth-pageA',
      name: 'FrontAuthPageA',
      component: '/demo/permission/front/AuthPageA',
      meta: {
        title: 'routes.demo.permission.frontTestA',
      },
    },
    {
      path: 'auth-pageB',
      name: 'FrontAuthPageB',
      component: '/demo/permission/front/AuthPageB',
      meta: {
        title: 'routes.demo.permission.frontTestB',
      },
    },
  ],
};
const backRoute = {
  path: 'back',
  name: 'PermissionBackDemo',
  meta: {
    title: 'routes.demo.permission.back',
  },

  children: [
    {
      path: 'page',
      name: 'BackAuthPage',
      component: '/demo/permission/back/index',
      meta: {
        title: 'routes.demo.permission.backPage',
      },
    },
    {
      path: 'btn',
      name: 'BackAuthBtn',
      component: '/demo/permission/back/Btn',
      meta: {
        title: 'routes.demo.permission.backBtn',
      },
    },
  ],
};
const authRoute = {
  path: '/permission',
  name: 'Permission',
  component: 'LAYOUT',
  redirect: '/permission/front/page',
  meta: {
    icon: 'carbon:user-role',
    title: 'routes.demo.permission.permission',
  },
  children: [frontRoute, backRoute],
};

const authRoute1 = {
  path: '/permission',
  name: 'Permission',
  component: 'LAYOUT',
  redirect: '/permission/front/page',
  meta: {
    icon: 'carbon:user-role',
    title: 'routes.demo.permission.permission',
  },
  children: [backRoute],
};

const levelRoute = {
  path: '/level',
  name: 'Level',
  component: 'LAYOUT',
  redirect: '/level/menu1/menu1-1',
  meta: {
    icon: 'carbon:user-role',
    title: 'routes.demo.level.level',
  },

  children: [
    {
      path: 'menu1',
      name: 'Menu1Demo',
      meta: {
        title: 'Menu1',
      },
      children: [
        {
          path: 'menu1-1',
          name: 'Menu11Demo',
          meta: {
            title: 'Menu1-1',
          },
          children: [
            {
              path: 'menu1-1-1',
              name: 'Menu111Demo',
              component: '/demo/level/Menu111',
              meta: {
                title: 'Menu111',
              },
            },
          ],
        },
        {
          path: 'menu1-2',
          name: 'Menu12Demo',
          component: '/demo/level/Menu12',
          meta: {
            title: 'Menu1-2',
          },
        },
      ],
    },
    {
      path: 'menu2',
      name: 'Menu2Demo',
      component: '/demo/level/Menu2',
      meta: {
        title: 'Menu2',
      },
    },
  ],
};
export default [
  {
    url: '/basic-api/getMenuListById',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { id } = query;
      if (!id || id === '1') {
        return resultSuccess([dashboardRoute, authRoute, levelRoute]);
      }
      if (id === '2') {
        return resultSuccess([dashboardRoute, authRoute1, levelRoute]);
      }
    },
  },
] as MockMethod[];

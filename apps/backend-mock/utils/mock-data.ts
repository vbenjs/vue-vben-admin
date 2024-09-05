export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Vben',
    roles: ['super'],
    username: 'vben',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
  },
];

export interface OrderInfo {
  id: number;
  rid: string;
  openOrder: number;
  destroyOrder: number;
  sort: string;
  time: number;
}

export const MOCK_ORDERS: OrderInfo[] = [
  { id: 1, rid: 'UX-23492349244', openOrder: 0, destroyOrder: 1, sort: 'A', time: 320800 },
  { id: 2, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 0, sort: 'B', time: 320800 },
  { id: 3, rid: 'CU-3492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 4, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'A', time: 320800 },
  { id: 5, rid: 'AX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 6, rid: 'BU-23492349244', openOrder: 0, destroyOrder: 1, sort: 'B', time: 320800 },
  { id: 7, rid: 'UX-23492349244', openOrder: 0, destroyOrder: 0, sort: 'C', time: 320800 },
  { id: 8, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'D', time: 320800 },
  { id: 9, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 0, sort: 'C', time: 320800 },
  { id: 10, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 11, rid: 'UX-5592349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 12, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 13, rid: 'UX-235492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 14, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 15, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 16, rid: 'UX-5164921649244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 17, rid: 'UX-2317923417244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 18, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 19, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 20, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 21, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 22, rid: 'UX-23492349244', openOrder: 0, destroyOrder: 0, sort: 'C', time: 320800 },
  { id: 23, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 24, rid: 'UX-43492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 25, rid: 'UX-23492349244', openOrder: 0, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 26, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 0, sort: 'C', time: 320800 },
  { id: 27, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 28, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 29, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 30, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 0, sort: 'C', time: 320800 },
  { id: 31, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 32, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 33, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 0, sort: 'C', time: 320800 },
  { id: 34, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  { id: 35, rid: 'UX-23492349244', openOrder: 1, destroyOrder: 1, sort: 'C', time: 320800 },
  // Add more rows as needed
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    component: 'BasicLayout',
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'page.demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'page.demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'page.demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  return [
    {
      component: 'BasicLayout',
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'page.demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'page.demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'page.demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'page.demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'page.demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus, ...createDemosMenus('super')],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('admin')],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('user')],
    username: 'jack',
  },
];

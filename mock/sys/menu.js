const ResultUtil = require('../_util/resultUtil');

const id1MenuList = {
  path: '/auth/role',
  name: 'RoleAuth',
  meta: {
    title: '基于角色',
  },
  children: [
    {
      path: '/auth/role/page',
      name: 'PageAuth',
      component: 'examples/auth/role/PageAuth',
      meta: {
        title: '页面权限',
      },
    },
    {
      path: '/auth/role/btn',
      name: '按钮权限',
      component: 'examples/auth/role/BtnAuth',
      meta: {
        title: '按钮权限',
      },
    },
    {
      path: '/auth/role/test1',
      name: 'AuthTest1',
      component: 'examples/auth/AuthTest1',
      meta: {
        title: 'Admin角色可见',
      },
    },
    {
      path: '/auth/role/test2',
      name: 'AuthTest2',
      component: 'examples/auth/AuthTest2',
      meta: {
        title: 'Normal角色可见',
      },
    },
  ],
};

const id2MenuList = {
  path: '/auth/back',
  name: 'BackAuth',
  meta: {
    title: '基于后台',
  },
  children: [
    {
      path: '/auth/back/page',
      name: 'BackPageAuth',
      component: 'examples/auth/back/PageAuth',
      meta: {
        title: '页面权限',
      },
    },
    {
      path: '/auth/back/btn',
      name: 'BackBtnAuth',
      component: 'examples/auth/back/BtnAuth',
      meta: {
        title: '按钮权限',
      },
    },
  ],
};

const getFakeList = (list) => [
  {
    component: 'PAGE_LAYOUT',
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/dashboard/analysis',
    meta: {
      title: 'Dashboard',
    },
    children: [
      {
        path: '/dashboard/welcome',
        name: 'Welcome',
        component: 'dashboard/welcome/index',
        meta: {
          title: '欢迎页',
        },
      },
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: 'dashboard/analysis/index',
        meta: {
          title: '分析页',
          affix: true,
        },
      },
    ],
  },
  {
    component: 'PAGE_LAYOUT',
    name: 'AuthTest',
    path: '/auth',
    meta: {
      title: '权限管理',
    },
    children: [...list],
  },
];

const fakeList = {
  // 用户id 为key，
  // admin
  1: getFakeList([id1MenuList, id2MenuList]),

  // 测试
  2: getFakeList([id2MenuList]),
};

const fakeCodeList = {
  // 用户id 为key，
  1: ['10000', '20000', '30000'],

  2: ['10010', '20020', '30030'],
};
module.exports = {
  'GET /getMenuListByUserId 20': ({ query }) => {
    const { userId } = query;
    return ResultUtil.success(userId ? fakeList[~~userId] || {} : {});
  },

  // 根据用户id获取按钮权限code
  'GET /getBtnCodeListByUserId 20': ({ query }) => {
    const { userId } = query;
    return ResultUtil.success(userId ? fakeCodeList[~~userId] || {} : {});
  },
};

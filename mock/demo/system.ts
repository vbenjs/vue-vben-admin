import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess, resultSuccess } from '../_util';

const accountList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      account: '@first',
      email: '@email',
      nickname: '@cname()',
      role: '@first',
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '1'],
    });
  }
  return result;
})();

const roleList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 4; index++) {
    result.push({
      id: `${index}`,
      orderNo: `${index + 1}`,
      roleName: ['超级管理员', '管理员', '文章管理员', '普通用户'][index],
      roleValue: '@first',
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '1'],
    });
  }
  return result;
})();

const deptList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      deptName: ['华东分部', '华南分部', '西北分部'][index],
      orderNo: index + 1,
      createTime: '@datetime',
      remark: '@cword(10,20)',
      'status|1': ['0', '0', '1'],
      children: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push({
            id: `${index}-${j}`,
            deptName: ['研发部', '市场部', '商务部', '财务部'][j],
            orderNo: j + 1,
            createTime: '@datetime',
            remark: '@cword(10,20)',
            'status|1': ['0', '1'],
            parentDept: `${index}`,
            children: undefined,
          });
        }
        return children;
      })(),
    });
  }
  return result;
})();

const menuList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      icon: ['ion:layers-outline', 'ion:git-compare-outline', 'ion:tv-outline'][index],
      component: 'LAYOUT',
      menuName: ['Dashboard', '权限管理', '功能'][index],
      permission: '',
      orderNo: index + 1,
      createTime: '@datetime',
      'status|1': ['0', '0', '1'],
      children: (() => {
        const children: any[] = [];
        for (let j = 0; j < 4; j++) {
          children.push({
            id: `${index}-${j}`,
            menuName: ['菜单1', '菜单2', '菜单3', '菜单4'][j],
            icon: 'ion:document',
            permission: ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index],
            component: [
              '/dashboard/welcome/index',
              '/dashboard/analysis/index',
              '/dashboard/workbench/index',
              '/dashboard/test/index',
            ][j],
            orderNo: j + 1,
            createTime: '@datetime',
            'status|1': ['0', '1'],
            parentMenu: `${index}`,
            children: undefined,
          });
        }
        return children;
      })(),
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/system/getAccountList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, accountList);
    },
  },
  {
    url: '/basic-api/system/getRoleListByPage',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, roleList);
    },
  },
  {
    url: '/basic-api/system/getAllRoleList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(roleList);
    },
  },
  {
    url: '/basic-api/system/getDeptList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(deptList);
    },
  },
  {
    url: '/basic-api/system/getMenuList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(menuList);
    },
  },
] as MockMethod[];

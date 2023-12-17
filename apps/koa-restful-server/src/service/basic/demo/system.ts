import { Controller, FromBody, FromQuery, HttpGet, HttpPost } from '@wangminghua/koa-restful';
import { mock } from 'mockjs';
import { resultError, resultPageSuccess, resultSuccess } from '../../../_util';

@Controller()
export class SystemController {
  @HttpGet()
  getAccountList(@FromQuery() page: number = 1, @FromQuery() pageSize: number = 20) {
    return resultPageSuccess(page, pageSize, accountList);
  }
  @HttpGet()
  getRoleListByPage(@FromQuery() page: number = 1, @FromQuery() pageSize: number = 20) {
    return resultPageSuccess(page, pageSize, roleList);
  }
  @HttpPost()
  setRoleStatus(@FromQuery() id, @FromQuery() status) {
    return resultSuccess({ id, status });
  }
  @HttpGet()
  getAllRoleList() {
    return resultSuccess(roleList);
  }
  @HttpGet()
  getDeptList() {
    return resultSuccess(deptList);
  }
  @HttpGet()
  getMenuList() {
    return resultSuccess(menuList);
  }
  @HttpPost()
  accountExist(@FromBody() body: { account: string }) {
    const { account } = body || {};
    if (account && account.indexOf('admin') !== -1) {
      return resultError('该字段不能包含admin');
    } else {
      return resultSuccess(`${account} can use`);
    }
  }
}

const accountList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push(
      mock({
        id: `${index}`,
        account: '@first',
        email: '@email',
        nickname: '@cname()',
        role: '@first',
        createTime: '@datetime',
        remark: '@cword(10,20)',
        'dept|0-2': 1,
        'status|1': ['0', '1'],
      }),
    );
  }
  return result;
})();

const roleList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 4; index++) {
    result.push(
      mock({
        id: index + 1,
        orderNo: `${index + 1}`,
        roleName: ['超级管理员', '管理员', '文章管理员', '普通用户'][index],
        roleValue: '@first',
        createTime: '@datetime',
        remark: '@cword(10,20)',
        menu: [['0', '1', '2'], ['0', '1'], ['0', '2'], ['2']][index],
        'status|1': ['0', '1'],
      }),
    );
  }
  return result;
})();

const deptList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push(
      mock({
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
      }),
    );
  }
  return result;
})();

const menuList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 3; index++) {
    result.push(
      mock({
        id: `${index}`,
        icon: ['ion:layers-outline', 'ion:git-compare-outline', 'ion:tv-outline'][index],
        component: 'LAYOUT',
        type: '0',
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
              type: '1',
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
              children: (() => {
                const children: any[] = [];
                for (let k = 0; k < 4; k++) {
                  children.push({
                    id: `${index}-${j}-${k}`,
                    type: '2',
                    menuName: '按钮' + (j + 1) + '-' + (k + 1),
                    icon: '',
                    permission:
                      ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index] +
                      ':btn' +
                      (k + 1),
                    component: [
                      '/dashboard/welcome/index',
                      '/dashboard/analysis/index',
                      '/dashboard/workbench/index',
                      '/dashboard/test/index',
                    ][j],
                    orderNo: j + 1,
                    createTime: '@datetime',
                    'status|1': ['0', '1'],
                    parentMenu: `${index}-${j}`,
                    children: undefined,
                  });
                }
                return children;
              })(),
            });
          }
          return children;
        })(),
      }),
    );
  }
  return result;
})();

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

export default [
  {
    url: '/api/system/getAccountList',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, accountList);
    },
  },
  {
    url: '/api/system/getDeptList',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(deptList);
    },
  },
] as MockMethod[];

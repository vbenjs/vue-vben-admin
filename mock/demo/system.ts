import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess } from '../_util';

const list = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      id: `${index}`,
      account: '@first',
      email: '@email',
      nickname: '@cname()',
      role: '@first',
      updateTime: '@datetime',
      remark: '@cword(0,20)',
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
      return resultPageSuccess(page, pageSize, list);
    },
  },
] as MockMethod[];

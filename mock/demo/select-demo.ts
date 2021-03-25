import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

const demoList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      label: `选项${index}`,
      value: `${index}`,
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/select/getDemoOptions',
    timeout: 2000,
    method: 'get',
    response: ({ query }) => {
      console.log(query);
      return resultSuccess(demoList);
    },
  },
] as MockMethod[];

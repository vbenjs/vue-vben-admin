import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

const userInfo = {
  name: 'Vben',
  userid: '00000001',
  email: 'antdesign@alipay.com',
  signature: '海纳百川，有容乃大',
  introduction: '微笑着，努力着，欣赏着',
  title: '交互专家',
  group: '蚂蚁集团11－某某某事业群－某某平台部－某某技术部－UED',
  tags: [
    {
      key: '0',
      label: '很有想法的',
    },
    {
      key: '1',
      label: '专注设计',
    },
    {
      key: '2',
      label: '辣~',
    },
    {
      key: '3',
      label: '大长腿',
    },
    {
      key: '4',
      label: '川妹子',
    },
    {
      key: '5',
      label: '海纳百川',
    },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: 'China',
  address: '厦门市 77 号',
  phone: '0592-268888888',
};

export default [
  {
    url: '/api/account/getAccountInfo',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(userInfo);
    },
  },
] as MockMethod[];

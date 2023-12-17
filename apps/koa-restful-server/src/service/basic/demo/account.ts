import { Controller, HttpError, HttpGet, HttpPost } from '@wangminghua/koa-restful';
import { ResultEnum, resultError, resultSuccess } from '../../../_util';

@Controller('')
export class AccountController {
  @HttpGet('/account/getAccountInfo')
  getAccountInfo() {
    return resultSuccess(userInfo);
  }
  @HttpPost('/user/sessionTimeout')
  sessionTimeout() {
    throw new HttpError(resultError(), 401);
  }
  @HttpPost('/user/tokenExpired')
  tokenExpired() {
    return resultError('Token Expired!', { code: ResultEnum.TIMEOUT as number });
  }
}
const userInfo = {
  name: 'Vben',
  userid: '00000001',
  email: 'test@gmail.com',
  signature: '海纳百川，有容乃大',
  introduction: '微笑着，努力着，欣赏着',
  title: '交互专家',
  group: '某某某事业群－某某平台部－某某技术部－UED',
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
  address: 'Xiamen City 77',
  phone: '0592-268888888',
};

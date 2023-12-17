import { Authorize, Controller, FromBody, HttpGet, HttpPost } from '@wangminghua/koa-restful';
import { getRequestToken, resultError, resultSuccess } from '../../../_util';

@Controller('')
export class UserController {
  @HttpPost()
  login(@FromBody() body: { username: string; password: string }) {
    const { username, password } = body;

    const checkUser = createFakeUserList().find(
      (item) => item.username === username && password === item.password,
    );
    if (!checkUser) {
      return resultError('Incorrect account or password！');
    }
    const { userId, username: _username, token, realName, desc, roles } = checkUser;
    return resultSuccess({
      roles,
      userId,
      username: _username,
      token,
      realName,
      desc,
    });
  }
  @Authorize()
  @HttpGet()
  getUserInfo(request) {
    const token = getRequestToken(request);
    if (!token) return resultError('Invalid token');
    const checkUser = createFakeUserList().find((item) => item.token === token);
    if (!checkUser) {
      return resultError('Invalid token!');
    }
    const codeList = fakeCodeList[checkUser.userId];

    return resultSuccess(codeList);
  }

  @Authorize()
  @HttpGet()
  getPermCode(request) {
    const token = getRequestToken(request);
    if (!token) return resultError('Invalid token');
    const checkUser = createFakeUserList().find((item) => item.token === token);
    if (!checkUser) {
      return resultError('Invalid token!');
    }
    const codeList = fakeCodeList[checkUser.userId];

    return resultSuccess(codeList);
  }
}
const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'vben',
      realName: 'Vben Admin',
      avatar: '',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: '',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

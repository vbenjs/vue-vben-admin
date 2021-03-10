import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess } from '../_util';

function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'vben',
      realName: 'Vben Admin',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
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
      desc: 'tester',
      token: 'fakeToken2',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};
export default [
  // mock user login
  {
    url: '/basic-api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body;
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password
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
    },
  },
  {
    url: '/basic-api/getUserInfoById',
    method: 'get',
    response: ({ query }) => {
      const { userId } = query;
      const checkUser = createFakeUserList().find((item) => item.userId === userId);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
  {
    url: '/basic-api/getPermCodeByUserId',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { userId } = query;
      if (!userId) {
        return resultError('userId is not null!');
      }
      const codeList = fakeCodeList[userId];

      return resultSuccess(codeList);
    },
  },
] as MockMethod[];

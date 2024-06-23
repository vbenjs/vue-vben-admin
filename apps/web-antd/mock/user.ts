import { getRequestToken, resultError, resultSuccess } from './_util';

const fakeUserList = [
  {
    accessToken: 'fakeAdminToken',
    avatar: '',
    desc: 'manager',
    homePath: '/',
    password: '123456',
    realName: 'Vben Admin',
    roles: [
      {
        roleName: 'Super Admin',
        value: 'super',
      },
    ],
    userId: '1',
    username: 'vben',
  },
  {
    accessToken: 'fakeTestToken',
    avatar: '',
    desc: 'tester',
    homePath: '/',
    password: '123456',
    realName: 'test user',
    roles: [
      {
        roleName: 'Tester',
        value: 'test',
      },
    ],
    userId: '2',
    username: 'test',
  },
];

export default [
  {
    method: 'post',
    response: ({ body }: any) => {
      const { password, username } = body;
      const checkUser = fakeUserList.find(
        (item) => item.username === username && password === item.password,
      );
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const {
        accessToken,
        desc,
        realName,
        roles,
        userId,
        username: _username,
      } = checkUser;
      return resultSuccess({
        accessToken,
        desc,
        realName,
        roles,
        userId,
        username: _username,
      });
    },
    timeout: 200,
    url: '/vben-api/login',
  },
  {
    method: 'get',
    response: (request: any) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = fakeUserList.find((item) => item.accessToken === token);
      if (!checkUser) {
        return resultError(
          'The corresponding user information was not obtained!',
        );
      }
      const { accessToken: _token, password: _pwd, ...rest } = checkUser;
      return resultSuccess(rest);
    },
    url: '/vben-api/getUserInfo',
  },
  {
    method: 'get',
    response: (request: any) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = fakeUserList.find((item) => item.accessToken === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, {
        message: 'Token has been destroyed',
      });
    },
    timeout: 200,
    url: '/vben-api/logout',
  },
];

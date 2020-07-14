import ResultUtil from '../_util/resultUtil';

const fakeUserList = [
  {
    userId: '1',
    username: 'admin',
    realName: '管理员',
    desc: 'vben admin 管理员',
    password: '123456',
    token: 'fakeToken1',
  },
  {
    userId: '2',
    username: 'vben',
    password: '123456',
    realName: '测试用户',
    desc: 'vben admin 测试员',
    token: 'fakeToken2',
  },
];
const fakeRoles = [
  {
    // 只是模拟
    userId: '2',
    roleName: '普通用户',
    value: 'normal',
  },
  {
    userId: '1',
    roleName: '管理员',
    value: 'admin',
  },
];

export default {
  // 300 延时时间
  'POST /login 300': ({ body }) => {
    const { username, password } = body;

    const checkUser = fakeUserList.find(
      (item) => item.username === username && password === item.password
    );
    if (!checkUser) {
      return ResultUtil.error('Incorrect account or password(vben/123456,test1/123456)！');
    }
    const { userId, username: _username, token, realName, desc } = checkUser;
    const roles = fakeRoles.filter((item) => item.userId === userId);
    return ResultUtil.success({
      roles,
      userId,
      username: _username,
      token,
      realName,
      desc,
    });
  },
  'GET /v1.0/getUserInfoById 300': ({ query }) => {
    const { userId } = query;
    const checkUser = fakeUserList.find((item) => item.userId === userId);

    if (!checkUser) {
      return ResultUtil.error('未获取到相应的用户信息！');
    }
    const roles = fakeRoles.filter((item) => item.userId === userId);
    delete checkUser.password;
    delete checkUser.token;

    return ResultUtil.success({
      roles,
      ...checkUser,
    });
  },
};

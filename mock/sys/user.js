const ResultUtil = require('../_util/resultUtil');

const getFakeUserList = () => [
  {
    userId: '1',
    username: 'admin',
    realName: '管理员',
    desc: ' admin 管理员',
    password: '123456',
    token: 'fakeToken1',
  },
  {
    userId: '2',
    username: 'test',
    password: '123456',
    realName: '测试用户',
    desc: '测试员',
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

module.exports = {
  // 300 延时时间
  'POST /login 300': ({ body }) => {
    const { username, password } = body;
    const checkUser = getFakeUserList().find(
      (item) => item.username === username && password === item.password
    );

    if (!checkUser) {
      return ResultUtil.error('Incorrect account or password(test/123456,admin/123456)！');
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
  'GET /getUserInfoById 300': ({ query }) => {
    const { userId } = query;
    const checkUser = getFakeUserList().find((item) => item.userId === userId);

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

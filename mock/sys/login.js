import ResultUtil from '../_util/resultUtil';

const fakeUserList = [
  {
    userId: '2',
    username: 'admin',
    realName: '管理员',
    desc: 'vben admin 管理员',
    password: '123456',
    token: 'fakeToken1',
  },
  {
    userId: '1',
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
    userId: '1',
    roleName: '普通用户',
    value: 'normal',
  },
  {
    userId: '2',
    roleName: '管理员',
    value: 'admin',
  },
];

export default {
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
};

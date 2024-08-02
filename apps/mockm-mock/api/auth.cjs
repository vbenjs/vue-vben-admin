/* eslint-disable */

const { 
  wrapApiData,
  useResponseSuccess,
  useResponseError,
  MOCK_USERS,
  MOCK_CODES,
  MOCK_MENUS,
 } = require(`../util.cjs`)

/** @type {import('mockm/@types/config').Config} */
module.exports = util => {
  const {
    libObj: { mockjs },
  } = util
  return {
    api: {
      '/api/auth/codes'(req, res) {
        const token = req.get(`Authorization`)
        if (!token) {
          return res.status(401).json(useResponseError('UnauthorizedException', 'Unauthorized Exception'))
        }
        const username = Buffer.from(token, 'base64').toString('utf8');

        const codes = MOCK_CODES.find((item) => item.username === username)?.codes ?? [];
        res.json(useResponseSuccess(codes))
      },
      'post /api/auth/login'(req, res) {
        const { password, username } = req.body;

        const findUser = MOCK_USERS.find(
          (item) => item.username === username && item.password === password,
        );
      
        if (!findUser) {
          return res.status(403).json(useResponseError('UnauthorizedException', '用户名或密码错误'))
        }
      
        const accessToken = Buffer.from(username).toString('base64');
        res.json(useResponseSuccess({
          accessToken,
          // TODO: refresh token
          refreshToken: accessToken,
        }));
      },
    },
  }
}

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
      '/api/user/info'(req, res) {
        const token = req.get(`Authorization`)
        if (!token) {
          return res.status(401).json(useResponseError('UnauthorizedException', 'Unauthorized Exception'))
        }
        const username = Buffer.from(token, 'base64').toString('utf8');

        const user = MOCK_USERS.find((item) => item.username === username);

        const { password: _pwd, ...userInfo } = user;
        res.json(useResponseSuccess(user))
      },
    },
  }
}

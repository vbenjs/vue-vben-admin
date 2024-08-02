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
      '/api/menu/all'(req, res){
        const menus =  MOCK_MENUS.find((item) => item.username === req.username)?.menus ?? [];
        res.json(useResponseSuccess(menus))

      },
    },
  }
}

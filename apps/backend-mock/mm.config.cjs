const {
  wrapApiData,
  useResponseSuccess,
  useResponseError,
} = require(`./util.cjs`)
const getUser = require(`./get-user.cjs`)

/**
 * 配置说明请参考文档: 
 * https://hongqiye.com/doc/mockm/config/option.html
 * @type {import('mockm/@types/config').Config}
 */
module.exports = util => {
  return {
    watch: [`./api/`],
    plugin: [getUser],
    proxy: {
      '/': `http://www.httpbin.org/`, // 后端接口主域
    },
    api: {
      'use /'(req, res, next){
        const noCheckList = [
          `/`,
          `/public`,
          `/favicon.ico`,
          `/api/test`,
          `/api/status`,
          `/api/auth/login`,
        ]
        if( req.path === `/` || noCheckList.some(item => {
          return item.startsWith(req.path)
        })) {
          next()
        } else {
          const token = req.get(`Authorization`)
          if (!token) {
            return res.status(401).json(useResponseError('UnauthorizedException', 'Unauthorized Exception'))
          }
          next()
        }
      },
      // 跳转到接口列表
      '/api'(req, res){
        const url = `http://127.0.0.1:${globalThis.config.testPort}/#/apiStudio`
        res.redirect(url)
      },
      ...require(`./api/auth.cjs`)(util).api,
      ...require(`./api/menu.cjs`)(util).api,
      ...require(`./api/user.cjs`)(util).api,
      '/api/status'(req, res) {
        const { status } = req.query
        res.status(status).json(useResponseError())
      },
      'get /api/test': `Test get handler`,
      'post /api/test': `Test post handler`,
    },
    static: [],
    resHandleReplay: ({req, res}) => useResponseSuccess({}),
    resHandleJsonApi: ({req, res: {statusCode: code}, data}) => wrapApiData({code, data}),
  }
}

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const JWT_STRATEGY = 'jwt'

// http请求code
export enum HttpResultCodeEnum {
  // 请求成功
  SUCCESS = 0,

  // 系统错误
  FAIL = -1,

  // 参数错误
  BAD_REQUEST = -2,

  // 登陆过期
  SESSION_TIME_OUT = -3,

  // 非法操作
  FORBIDDEN = -3,

  // 404
  NOT_FOUND = -4,

  // 用户不存在
  NO_USER = -5,
}

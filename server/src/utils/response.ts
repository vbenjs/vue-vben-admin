import { HttpResultCodeEnum } from '../constants'
export class ResponseWrapper {
  static success<T = any>(data: T, msg = '操作成功'): HttpResult<T> {
    return {
      code: HttpResultCodeEnum.SUCCESS,
      data,
      message: msg,
      type: 'success',
    }
  }

  static error<T = null>(
    msg: string,
    code = HttpResultCodeEnum.FAIL,
  ): HttpResult<T> {
    return {
      code: code,
      data: null,
      message: msg,
      type: 'error',
    }
  }

  static timeOut<T = null>(msg = '身份认证信息已过期!'): HttpResult<T> {
    return {
      code: HttpResultCodeEnum.SESSION_TIME_OUT,
      data: null,
      message: msg,
      type: 'error',
    }
  }
}

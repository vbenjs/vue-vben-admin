import {
  ArgumentsHost,
  Catch,
  HttpException,
  ExceptionFilter,
  UnauthorizedException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common'
import { Request } from 'express'
import { Logger } from '../../plugins'
import { ResponseWrapper } from '../../utils/response'
import { BasicException } from '../exception'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest() as Request

    let logMsg = ''
    // 自定义异常
    if (exception instanceof BasicException) {
      logMsg = exception.getErrorMessage()
      response
        .status(HttpStatus.OK)
        .json(ResponseWrapper.error(`${logMsg}`, exception.getErrorCode()))
      // http异常
    } else if (exception instanceof UnauthorizedException) {
      logMsg += '身份信息校验错误!'
      response
        .status(HttpStatus.OK)
        // [UnauthorizedException]:
        .json(ResponseWrapper.timeOut(`身份信息校验错误！`))
    } else if (exception instanceof ForbiddenException) {
      logMsg += '没有访问权限!'
      response
        .status(HttpStatus.OK)
        // [ForbiddenException]:
        .json(ResponseWrapper.error(` 没有访问权限！`))
    } else if (exception instanceof HttpException) {
      const msg = exception.message as any
      const message = msg || msg.message || msg.error || null
      logMsg = message
      response
        .status(HttpStatus.OK)
        // [HttpException]:
        .json(ResponseWrapper.error(`${message}`))
    } else {
      logMsg = '[系统异常]:' + exception
      response
        .status(HttpStatus.OK)
        .json(ResponseWrapper.error('[系统异常]: 请联系系统管理员处理！'))
    }

    const { url, method } = request
    Logger.error(`[URL]=${url} - ${method}=> ` + logMsg)
  }
}

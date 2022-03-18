import { HttpException, HttpStatus } from '@nestjs/common'
import { HttpResultCodeEnum } from '../../constants'

export class BasicException extends HttpException {
  protected errorMessage: string
  protected errorCode: HttpResultCodeEnum
  constructor(
    errorMessage: string,
    errorCode: HttpResultCodeEnum = HttpResultCodeEnum.FAIL,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errorMessage, statusCode)

    this.errorMessage = errorMessage
    this.errorCode = errorCode
  }

  getErrorCode(): HttpResultCodeEnum {
    return this.errorCode
  }

  getErrorMessage(): string {
    return this.errorMessage
  }
}

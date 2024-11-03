import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

import { BadRequestException, Catch, HttpException } from '@nestjs/common';

import { ResponseClass } from '#/interfaces/response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const results = exception.getResponse() as any;

    // eslint-disable-next-line unicorn/throw-new-error
    const result = ResponseClass.Error(results.message);

    // 参数校验错误，默认都是BadRequestException
    const isArrayMessage = Array.isArray(results.message);
    const isValidationError =
      isArrayMessage &&
      typeof results.message[0] === 'string' &&
      results.message[0].includes('⓿');
    if (exception instanceof BadRequestException && isValidationError) {
      const message: Array<{ field: string; message: Array<string> }> = [];
      results.message.forEach((item: string) => {
        const [key, val] = item.split('⓿') as [string, string];
        const findData = message.find((item) => item.field === key);
        if (findData) {
          findData.message.push(val);
        } else {
          message.push({ field: key, message: [val] });
        }
      });

      result.error = message;
    }

    return response.status(status).json(result);
  }
}

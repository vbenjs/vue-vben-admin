import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';

import { Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseClass, SkipResCheck } from '#/interfaces/response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseClass<T>>
{
  private readonly logger = new Logger('HTTP响应');

  constructor(private readonly Reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseClass<T>> {
    const isSkipResCheck = this.Reflector.getAllAndOverride<boolean>(
      SkipResCheck,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data) => {
        data = isSkipResCheck ? data : ResponseClass.Success(data);
        this.logger.verbose(JSON.stringify(data));
        return data;
      }),
    );
  }
}

// 默认导出，便于glob导入
export default TransformInterceptor;

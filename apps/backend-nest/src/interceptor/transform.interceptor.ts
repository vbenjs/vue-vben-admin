import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseClass, SkipResCheck } from '#/interfaces/response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseClass<T>>
{
  constructor(private readonly Reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseClass<T>> {
    const isSkipResCheck = this.Reflector.getAllAndOverride<boolean>(
      SkipResCheck,
      [context.getHandler(), context.getClass()],
    );

    if (isSkipResCheck) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => ResponseClass.Success(data)));
  }
}

// 默认导出，便于glob导入
export default TransformInterceptor;

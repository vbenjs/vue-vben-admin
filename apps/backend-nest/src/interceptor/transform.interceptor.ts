import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseClass } from '#/interfaces/response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseClass<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseClass<T>> {
    return next.handle().pipe(map((data) => ResponseClass.Success(data)));
  }
}

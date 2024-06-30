import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map((data) => {
        const logFormat = `
          Request original url: ${req.originalUrl}
          Method: ${req.method}
          IP: ${req.ip}
          User: ${JSON.stringify(req.user)}
          Response data: ${JSON.stringify(data)}
         `;
        Logger.debug(logFormat);
        return {
          code: 0,
          data,
          error: null,
          message: 'ok',
        };
      }),
    );
  }
}

import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export default cookieParser();

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

declare global {
  export namespace Express {
    export interface Request {
      /**
       * 请求密钥
       * [可选] 如果向`cookie-parser`传递了密钥，则此属性将包含密钥。
       * 可以被其他中间件使用
       */
      secret?: string | undefined;
      /** 解析尚未签名的cookie */
      cookies: Record<string, any>;
      /** 解析已签名的cookie */
      signedCookies: Record<string, any>;
    }
  }
}

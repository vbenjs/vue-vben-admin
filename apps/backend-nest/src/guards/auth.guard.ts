import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const Public = Reflector.createDecorator<never>();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly Reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.Reflector.getAllAndOverride<boolean>(Public, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

// 默认导出，便于glob导入
export default JwtAuthGuard;

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './index.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly AuthService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const findUser = await this.AuthService.validateUser(username, password);

    if (!findUser) {
      throw new ForbiddenException('用户名或密码错误');
    }

    return findUser;
  }
}

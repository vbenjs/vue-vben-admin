import type { JwtConfig, JwtPayload } from '@/types';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<JwtConfig>('jwt').refreshSecret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('jwt refresh strategy validate payload', payload);
    return {
      id: payload.id,
      roles: payload.roles,
      username: payload.username,
    };
  }
}

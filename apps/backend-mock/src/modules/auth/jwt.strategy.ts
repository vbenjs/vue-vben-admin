import type { JwtConfig, JwtPayload } from '@/types';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<JwtConfig>('jwt').secret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('jwt strategy validate payload', payload);
    return {
      id: payload.id,
      roles: payload.roles,
      username: payload.username,
    };
  }
}

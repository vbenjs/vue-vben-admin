import type { JwtConfig } from '@/types';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtRefreshStrategy } from './refresh-token.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { expiresIn, secret } = configService.get<JwtConfig>('jwt');
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy],
})
export class AuthModule {}

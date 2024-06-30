import configuration from '@/config/index';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { MenuModule } from './modules/menu/menu.module';
import { MockModule } from './modules/mock/mock.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        port: Joi.number(),
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    MenuModule,
    MockModule,
  ],
})
export class AppModule {}

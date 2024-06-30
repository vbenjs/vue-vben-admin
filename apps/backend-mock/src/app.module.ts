import configuration from '@/config/index';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: 'data/db.sqlite',
      synchronize: true,
      type: 'sqlite',
    }),
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
    DatabaseModule,
  ],
})
export class AppModule {}

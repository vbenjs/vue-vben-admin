import type { MiddlewareConsumer, NestModule } from '@nestjs/common';

import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth';
import filters from '#/filters';
import guards from '#/guards';
import interceptors from '#/interceptor';
import middlewares from '#/middlewares';
import { RoutesModule } from '#/routes';

@Module({
  imports: [RoutesModule, AuthModule],
  providers: [...guards, ...interceptors, ...filters],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(...middlewares).forRoutes('*');
  }
}

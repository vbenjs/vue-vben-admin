import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth';
import filters from '#/filters';
import guards from '#/guards';
import interceptors from '#/interceptor';
import { RoutesModule } from '#/routes';

@Module({
  imports: [RoutesModule, AuthModule],
  providers: [...guards, ...interceptors, ...filters],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}

import { Module } from '@nestjs/common';

import guards from '#/guards';
import { RoutesModule } from '#/routes';

@Module({
  imports: [RoutesModule],
  providers: [...guards],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}

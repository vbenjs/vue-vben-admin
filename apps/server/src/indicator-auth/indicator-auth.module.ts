import { Module } from '@nestjs/common';

import { IndicatorAuthController } from './indicator-auth.controller';
import { IndicatorAuthService } from './indicator-auth.service';

@Module({
  controllers: [IndicatorAuthController],
  providers: [IndicatorAuthService],
  exports: [IndicatorAuthService],
})
export class IndicatorAuthModule {}

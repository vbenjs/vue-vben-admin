import { Module } from '@nestjs/common';

import { IndicatorAdjustController } from './indicator-adjust.controller';
import { IndicatorAdjustService } from './indicator-adjust.service';

@Module({
  controllers: [IndicatorAdjustController],
  providers: [IndicatorAdjustService],
  exports: [IndicatorAdjustService],
})
export class IndicatorAdjustModule {}

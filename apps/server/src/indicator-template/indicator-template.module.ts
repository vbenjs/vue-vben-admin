import { Module } from '@nestjs/common';

import { IndicatorTemplateController } from './indicator-template.controller';
import { IndicatorTemplateService } from './indicator-template.service';

@Module({
  controllers: [IndicatorTemplateController],
  providers: [IndicatorTemplateService],
  exports: [IndicatorTemplateService],
})
export class IndicatorTemplateModule {}

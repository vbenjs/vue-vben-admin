import { Module } from '@nestjs/common';

import { IndicatorTransferController } from './indicator-transfer.controller';
import { IndicatorTransferService } from './indicator-transfer.service';

@Module({
  controllers: [IndicatorTransferController],
  providers: [IndicatorTransferService],
  exports: [IndicatorTransferService],
})
export class IndicatorTransferModule {}

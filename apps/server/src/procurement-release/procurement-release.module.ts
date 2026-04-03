import { Module } from '@nestjs/common';

import { ProcurementReleaseController } from './procurement-release.controller';
import { ProcurementReleaseService } from './procurement-release.service';

@Module({
  controllers: [ProcurementReleaseController],
  providers: [ProcurementReleaseService],
})
export class ProcurementReleaseModule {}

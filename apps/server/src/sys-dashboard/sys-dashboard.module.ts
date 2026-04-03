import { Module } from '@nestjs/common';

import { SysDashboardController } from './sys-dashboard.controller';
import { SysDashboardService } from './sys-dashboard.service';

@Module({
  controllers: [SysDashboardController],
  providers: [SysDashboardService],
})
export class SysDashboardModule {}

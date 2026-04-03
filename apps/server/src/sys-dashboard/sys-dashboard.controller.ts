import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Controller, Get } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';
import { SysDashboardService } from './sys-dashboard.service';

@Controller('sys-dashboard')
export class SysDashboardController {
  constructor(private readonly dashboardService: SysDashboardService) {}

  @Get('statistics')
  async getStatistics(@RequestContext() requestContext: AppRequestContext) {
    return this.dashboardService.getStatistics(requestContext);
  }
}

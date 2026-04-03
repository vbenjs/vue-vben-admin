import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Controller, Get, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';
import { FinanceVoucherService } from './finance-voucher.service';

@Controller('finance/voucher')
export class FinanceVoucherController {
  constructor(private readonly financeVoucherService: FinanceVoucherService) {}

  @Get('list')
  findAll(
    @Query('indicatorCode') indicatorCode?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.financeVoucherService.findAll(
      {
        indicatorCode,
        keyword,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 20,
      },
      requestContext,
    );
  }
}

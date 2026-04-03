import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Controller, Get, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';
import { FinanceReimbursementService } from './finance-reimbursement.service';

@Controller('finance/reimbursement')
export class FinanceReimbursementController {
  constructor(private readonly financeReimbursementService: FinanceReimbursementService) {}

  @Get('list')
  findAll(
    @Query('billNo') billNo?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.financeReimbursementService.findAll(
      {
        billNo,
        keyword,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 20,
        status,
      },
      requestContext,
    );
  }

  @Get('detail')
  getDetail(
    @Query('billNo') billNo?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.financeReimbursementService.getDetail(billNo || '', requestContext);
  }
}

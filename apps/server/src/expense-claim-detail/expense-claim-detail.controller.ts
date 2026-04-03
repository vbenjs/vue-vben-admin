import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ExpenseClaimDetailService } from './expense-claim-detail.service';
@Controller('expense-claim-detail')
export class ExpenseClaimDetailController {
  constructor(private readonly expenseClaimDetailService: ExpenseClaimDetailService) {}
  @Post() async create(@Body() data: any) {
    return this.expenseClaimDetailService.create(data, 'admin');
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('usage') usage?: string,
    @Query('indicatorName') indicatorName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.expenseClaimDetailService.findAll(
      {
        fiscalYear,
        indicatorName,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        status,
        usage,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.expenseClaimDetailService.findOne(BigInt(id));
  }
  @Put(':id') async update(@Param('id') id: string, @Body() data: any) {
    return this.expenseClaimDetailService.update(BigInt(id), data, 'admin');
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.expenseClaimDetailService.remove(BigInt(id));
  }
}

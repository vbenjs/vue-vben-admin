import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ExpensePayerService } from './expense-payer.service';
@Controller('expense-payer')
export class ExpensePayerController {
  constructor(private readonly expensePayerService: ExpensePayerService) {}
  @Post() async create(@Body() data: any) {
    return this.expensePayerService.create(data, 'admin');
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('payerName') payerName?: string,
    @Query('bankName') bankName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.expensePayerService.findAll(
      {
        bankName,
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        payerName,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.expensePayerService.findOne(BigInt(id));
  }
  @Put(':id') async update(@Param('id') id: string, @Body() data: any) {
    return this.expensePayerService.update(BigInt(id), data, 'admin');
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.expensePayerService.remove(BigInt(id));
  }
}

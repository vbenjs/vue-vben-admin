import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ExpensePayeeService } from './expense-payee.service';
@Controller('expense-payee')
export class ExpensePayeeController {
  constructor(private readonly expensePayeeService: ExpensePayeeService) {}
  @Post() async create(@Body() data: any) {
    return this.expensePayeeService.create(data, 'admin');
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('payeeName') payeeName?: string,
    @Query('bankName') bankName?: string,
    @Query('bankAccount') bankAccount?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('isEnabled') isEnabled?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.expensePayeeService.findAll(
      {
        bankAccount,
        bankName,
        fiscalYear,
        isEnabled,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        payeeName,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.expensePayeeService.findOne(BigInt(id));
  }
  @Put(':id') async update(@Param('id') id: string, @Body() data: any) {
    return this.expensePayeeService.update(BigInt(id), data, 'admin');
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.expensePayeeService.remove(BigInt(id));
  }
}

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';
import { ResearchExpenseScopeService } from './research-expense-scope.service';

@Controller('research/expense-scope')
export class ResearchExpenseScopeController {
  constructor(private readonly researchExpenseScopeService: ResearchExpenseScopeService) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.researchExpenseScopeService.create(data, 'admin', requestContext);
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('indicatorId') indicatorId?: string,
    @Query('scopeName') scopeName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.researchExpenseScopeService.findAll(
      {
        fiscalYear,
        indicatorId,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        scopeName,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchExpenseScopeService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.researchExpenseScopeService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.researchExpenseScopeService.remove(BigInt(id));
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { IncomeSettlementService } from './income-settlement.service';

@Controller('income-settlement')
export class IncomeSettlementController {
  constructor(private readonly incomeSettlementService: IncomeSettlementService) {}

  @Post()
  async create(@Body() data: any) {
    return this.incomeSettlementService.create(data);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.incomeSettlementService.getById(BigInt(id));
  }

  @Get('list')
  async getList(@Query() query: any) {
    const page = Number.parseInt(query.page || '1', 10);
    const pageSize = Number.parseInt(query.pageSize || '10', 10);
    return this.incomeSettlementService.getList(page, pageSize, query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.incomeSettlementService.remove(BigInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.incomeSettlementService.update(BigInt(id), data);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { BudgetIndicatorService } from './budget-indicator.service';

@Controller('budget-indicator')
export class BudgetIndicatorController {
  constructor(private readonly svc: BudgetIndicatorService) {}

  @Post()
  async create(@Body() data: any) {
    return this.svc.create(data, 'admin');
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('deptName') deptName?: string,
    @Query('indicatorCode') indicatorCode?: string,
    @Query('indicatorName') indicatorName?: string,
    @Query('indicatorType') indicatorType?: string,
    @Query('projectCategory') projectCategory?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      deptName,
      indicatorCode,
      indicatorName,
      indicatorType,
      page: page ? Number.parseInt(page, 10) : 1,
      pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
      projectCategory,
      status,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.svc.findOne(BigInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.svc.update(BigInt(id), data, 'admin');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.svc.remove(BigInt(id));
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { IndicatorAdjustService } from './indicator-adjust.service';

@Controller('indicator-adjust')
export class IndicatorAdjustController {
  constructor(private readonly svc: IndicatorAdjustService) {}

  @Post()
  async create(@Body() data: any) { return this.svc.create(data, 'admin'); }

  @Get('list')
  async findAll(
    @Query('page') page?: string, @Query('pageSize') pageSize?: string,
    @Query('indicatorName') indicatorName?: string, @Query('deptName') deptName?: string,
    @Query('adjustType') adjustType?: string, @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      adjustType, deptName, indicatorName,
      page: page ? Number.parseInt(page, 10) : 1,
      pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
      status,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) { return this.svc.findOne(BigInt(id)); }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) { return this.svc.update(BigInt(id), data, 'admin'); }

  @Delete(':id')
  async remove(@Param('id') id: string) { return this.svc.remove(BigInt(id)); }
}

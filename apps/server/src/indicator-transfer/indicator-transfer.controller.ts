import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { IndicatorTransferService } from './indicator-transfer.service';

@Controller('indicator-transfer')
export class IndicatorTransferController {
  constructor(private readonly svc: IndicatorTransferService) {}

  @Post()
  async create(@Body() data: any) { return this.svc.create(data, 'admin'); }

  @Get('list')
  async findAll(
    @Query('page') page?: string, @Query('pageSize') pageSize?: string,
    @Query('transferNo') transferNo?: string, @Query('outDeptName') outDeptName?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      outDeptName,
      page: page ? Number.parseInt(page, 10) : 1,
      pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
      status, transferNo,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) { return this.svc.findOne(BigInt(id)); }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) { return this.svc.update(BigInt(id), data, 'admin'); }

  @Delete(':id')
  async remove(@Param('id') id: string) { return this.svc.remove(BigInt(id)); }
}

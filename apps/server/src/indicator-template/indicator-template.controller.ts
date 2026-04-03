import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { IndicatorTemplateService } from './indicator-template.service';

@Controller('indicator-template')
export class IndicatorTemplateController {
  constructor(private readonly svc: IndicatorTemplateService) {}

  @Post()
  async create(@Body() data: any) { return this.svc.create(data, 'admin'); }

  @Get('list')
  async findAll(
    @Query('page') page?: string, @Query('pageSize') pageSize?: string,
    @Query('templateName') templateName?: string, @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      page: page ? Number.parseInt(page, 10) : 1,
      pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
      status, templateName,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) { return this.svc.findOne(BigInt(id)); }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) { return this.svc.update(BigInt(id), data, 'admin'); }

  @Delete(':id')
  async remove(@Param('id') id: string) { return this.svc.remove(BigInt(id)); }
}

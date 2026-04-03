import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysFormDataService } from './sys-form-data.service';

@Controller('sys-form-data')
export class SysFormDataController {
  constructor(private readonly sysFormDataService: SysFormDataService) {}

  @Post()
  async create(@Body() data: any) {
    return this.sysFormDataService.create(data);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.sysFormDataService.getById(BigInt(id));
  }

  @Get('list')
  async getList(@Query() query: any) {
    const page = Number.parseInt(query.page || '1', 10);
    const pageSize = Number.parseInt(query.pageSize || '10', 10);
    return this.sysFormDataService.getList(page, pageSize, query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysFormDataService.remove(BigInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.sysFormDataService.update(BigInt(id), data);
  }
}

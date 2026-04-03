import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';

import { SysPrintDesignService } from './sys-printDesign.service';

@Controller('sys/printDesign')
export class SysPrintDesignController {
  constructor(private readonly service: SysPrintDesignService) {}

  @Post()
  async create(@Body() createData: any, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.service.create(createData, username);
  }

  @Get('list')
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.service.update(Number(id), updateData, username);
  }
}

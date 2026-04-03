import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysDeptService } from './sys-dept.service';

@Controller('sys/dept')
export class SysDeptController {
  constructor(private readonly sysDeptService: SysDeptService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysDeptService.create(createDto, username);
  }

  @Get('list')
  async findAll(@Query('deptName') deptName?: string, @Query('status') status?: string) {
    return this.sysDeptService.findAll({ deptName, status });
  }

  @Get('tree')
  async getTree(@Query('status') status?: string) {
    return this.sysDeptService.getTree({ status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysDeptService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysDeptService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysDeptService.update(+id, updateDto, username);
  }
}

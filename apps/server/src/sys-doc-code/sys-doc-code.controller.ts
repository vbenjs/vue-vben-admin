import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysDocCodeService } from './sys-doc-code.service';

@Controller('sys/doc-code')
export class SysDocCodeController {
  constructor(private readonly sysDocCodeService: SysDocCodeService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysDocCodeService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('ruleCode') ruleCode?: string,
    @Query('ruleName') ruleName?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysDocCodeService.findAll({ skip, take, ruleCode, ruleName });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysDocCodeService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysDocCodeService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysDocCodeService.update(+id, updateDto, username);
  }
}

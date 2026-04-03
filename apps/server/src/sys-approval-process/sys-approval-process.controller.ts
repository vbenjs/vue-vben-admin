import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysApprovalProcessService } from './sys-approval-process.service';

@Controller('sys/approval-process')
export class SysApprovalProcessController {
  constructor(private readonly sysApprovalProcessService: SysApprovalProcessService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysApprovalProcessService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('processName') processName?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysApprovalProcessService.findAll({ skip, take, processName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysApprovalProcessService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysApprovalProcessService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysApprovalProcessService.update(+id, updateDto, username);
  }
}

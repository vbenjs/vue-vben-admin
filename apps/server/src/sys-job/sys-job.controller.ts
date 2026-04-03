import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysJobService } from './sys-job.service';

@Controller('sys/job')
export class SysJobController {
  constructor(private readonly sysJobService: SysJobService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysJobService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('jobName') jobName?: string,
    @Query('jobGroup') jobGroup?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysJobService.findAll({ skip, take, jobName, jobGroup, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysJobService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysJobService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysJobService.update(+id, updateDto, username);
  }
}

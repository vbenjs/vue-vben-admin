import { Controller, Delete, Get, Param, Query } from '@nestjs/common';

import { SysOperLogService } from './sys-oper-log.service';

@Controller('sys/operlog')
export class SysOperLogController {
  constructor(private readonly sysOperLogService: SysOperLogService) {}

  @Delete('clean')
  async clean() {
    return this.sysOperLogService.clear();
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('title') title?: string,
    @Query('operName') operName?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysOperLogService.findAll({
      skip,
      take,
      title,
      operName,
      status: status ? Number(status) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysOperLogService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysOperLogService.remove(+id);
  }
}

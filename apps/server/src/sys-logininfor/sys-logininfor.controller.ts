import { Controller, Delete, Get, Param, Query } from '@nestjs/common';

import { SysLogininforService } from './sys-logininfor.service';

@Controller('sys/logininfor')
export class SysLogininforController {
  constructor(private readonly sysLogininforService: SysLogininforService) {}

  @Delete('clean')
  async clean() {
    return this.sysLogininforService.clear();
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('userName') userName?: string,
    @Query('ipaddr') ipaddr?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysLogininforService.findAll({ skip, take, userName, ipaddr, status });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysLogininforService.remove(+id);
  }
}

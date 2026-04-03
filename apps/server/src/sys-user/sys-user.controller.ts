import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysUserService } from './sys-user.service';

@Controller('sys/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysUserService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('userName') userName?: string,
    @Query('phonenumber') phonenumber?: string,
    @Query('status') status?: string,
    @Query('deptId') deptId?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    // 过滤前端可能传过来的无意义的值(比如空字符串、"undefined" 字符串等)
    const validDeptId = deptId && deptId !== 'undefined' ? Number(deptId) : undefined;
    return this.sysUserService.findAll({
      skip,
      take,
      userName,
      phonenumber,
      status,
      deptId: validDeptId && !isNaN(validDeptId) ? validDeptId : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysUserService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysUserService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysUserService.update(+id, updateDto, username);
  }
}

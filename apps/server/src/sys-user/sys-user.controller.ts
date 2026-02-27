import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { SysUserService } from './sys-user.service';

@Controller('sys/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Get('list')
  async findAll(
    @Query('page') page: string = '1', 
    @Query('pageSize') pageSize: string = '10', 
    @Query('userName') userName?: string,
    @Query('phonenumber') phonenumber?: string,
    @Query('status') status?: string,
    @Query('deptId') deptId?: string
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysUserService.findAll({ skip, take, userName, phonenumber, status, deptId: deptId ? Number(deptId) : undefined });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysUserService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin'; 
    return this.sysUserService.create(createDto, username);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysUserService.update(+id, updateDto, username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysUserService.remove(+id);
  }
}

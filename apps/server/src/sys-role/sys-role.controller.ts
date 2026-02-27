import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { SysRoleService } from './sys-role.service';

@Controller('sys/role')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @Get('list')
  async findAll(
    @Query('page') page: string = '1', 
    @Query('pageSize') pageSize: string = '10', 
    @Query('roleName') roleName?: string,
    @Query('status') status?: string
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysRoleService.findAll({ skip, take, roleName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysRoleService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin'; 
    return this.sysRoleService.create(createDto, username);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysRoleService.update(+id, updateDto, username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysRoleService.remove(+id);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysMenuService } from './sys-menu.service';

@Controller('sys/menu')
export class SysMenuController {
  constructor(private readonly sysMenuService: SysMenuService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysMenuService.create(createDto, username);
  }

  @Get('list')
  async findAll(@Query('menuName') menuName?: string, @Query('status') status?: string) {
    return this.sysMenuService.findAll({ menuName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysMenuService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysMenuService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysMenuService.update(+id, updateDto, username);
  }
}

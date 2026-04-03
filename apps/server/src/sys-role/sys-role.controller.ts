import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysRoleService } from './sys-role.service';

@Controller('sys/role')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysRoleService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('roleName') roleName?: string,
    @Query('roleKey') roleKey?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysRoleService.findAll({ skip, take, roleKey, roleName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysRoleService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysRoleService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysRoleService.update(+id, updateDto, username);
  }

  /** 获取角色已分配的菜单ID列表 */
  @Get(':id/menus')
  async getRoleMenus(@Param('id') id: string) {
    return this.sysRoleService.getRoleMenuIds(+id);
  }

  /** 保存角色的菜单权限分配 */
  @Put(':id/menus')
  async saveRoleMenus(@Param('id') id: string, @Body() body: { menuIds: number[] }) {
    return this.sysRoleService.saveRoleMenus(+id, body.menuIds);
  }
}

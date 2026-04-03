import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysTenantService } from './sys-tenant.service';

@Controller('sys/tenant')
export class SysTenantController {
  constructor(private readonly sysTenantService: SysTenantService) {}

  @Post()
  async create(@Body() createDto: any) {
    // 模拟从 req.user 获取
    const username = 'admin';
    return this.sysTenantService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('tenantName') tenantName?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysTenantService.findAll({ skip, take, tenantName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysTenantService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysTenantService.remove(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysTenantService.update(+id, updateDto, username);
  }
}

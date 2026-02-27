import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { SysFormDesignService } from './sys-form-design.service';

@Controller('sys/form-design')
export class SysFormDesignController {
  constructor(private readonly sysFormDesignService: SysFormDesignService) {}

  @Get('list')
  async findAll(@Query('page') page: string = '1', @Query('pageSize') pageSize: string = '10', @Query('formName') formName?: string, @Query('status') status?: string) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysFormDesignService.findAll({ skip, take, formName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysFormDesignService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';  // 模拟从Token获取
    return this.sysFormDesignService.create(createDto, username);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';  // 模拟从Token获取
    return this.sysFormDesignService.update(+id, updateDto, username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysFormDesignService.remove(+id);
  }
}

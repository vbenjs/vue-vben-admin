import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { SysFormDesignService } from './sys-form-design.service';

@Controller('sys/form-design')
export class SysFormDesignController {
  constructor(private readonly sysFormDesignService: SysFormDesignService) {}

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin'; // 模拟从Token获取
    return this.sysFormDesignService.create(createDto, username);
  }

  @Get('list')
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('formName') formName?: string,
    @Query('formType') formType?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysFormDesignService.findAll({ skip, take, formName, formType, status });
  }

  @Post('page-meta')
  async createPageMeta(@Body() createDto: any) {
    const username = 'admin';
    return this.sysFormDesignService.createPageMeta(createDto, username);
  }

  @Get('page-meta/list')
  async findPageMetaList(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('formName') formName?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysFormDesignService.findPageMetaList({ skip, take, formName, status });
  }

  @Get('page-meta/:id')
  async findPageMetaOne(@Param('id') id: string) {
    return this.sysFormDesignService.findPageMetaOne(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysFormDesignService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysFormDesignService.remove(+id);
  }

  @Delete('page-meta/:id')
  async removePageMeta(@Param('id') id: string) {
    return this.sysFormDesignService.removePageMeta(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin'; // 模拟从Token获取
    return this.sysFormDesignService.update(+id, updateDto, username);
  }

  @Put('page-meta/:id')
  async updatePageMeta(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysFormDesignService.updatePageMeta(+id, updateDto, username);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { ProjectLevel2Service } from './project-level2.service';

@Controller('project-level2')
export class ProjectLevel2Controller {
  constructor(private readonly svc: ProjectLevel2Service) {}

  @Post()
  async create(@Body() data: any) {
    return this.svc.create(data, 'admin');
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('projectName') projectName?: string,
    @Query('deptName') deptName?: string,
    @Query('level1Id') level1Id?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      deptName,
      level1Id,
      page: page ? Number.parseInt(page, 10) : 1,
      pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
      projectName,
      status,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.svc.findOne(BigInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.svc.update(BigInt(id), data, 'admin');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.svc.remove(BigInt(id));
  }
}

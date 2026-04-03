import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { ProjectLevel1Service } from './project-level1.service';

@Controller('project-level1')
export class ProjectLevel1Controller {
  constructor(private readonly svc: ProjectLevel1Service) {}

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
    @Query('status') status?: string,
  ) {
    return this.svc.findAll({
      deptName,
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

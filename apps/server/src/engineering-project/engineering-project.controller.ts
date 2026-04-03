import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { EngineeringProjectService } from './engineering-project.service';
@Controller('engineering-project')
export class EngineeringProjectController {
  constructor(private readonly engineeringProjectService: EngineeringProjectService) {}
  @Post() async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.engineeringProjectService.create(data, 'admin', requestContext);
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('projectCode') projectCode?: string,
    @Query('projectName') projectName?: string,
    @Query('projectStatus') projectStatus?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.engineeringProjectService.findAll(
      {
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        projectCode,
        projectName,
        projectStatus,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.engineeringProjectService.findOne(BigInt(id));
  }
  @Put(':id') async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.engineeringProjectService.update(BigInt(id), data, 'admin', requestContext);
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.engineeringProjectService.remove(BigInt(id));
  }
}

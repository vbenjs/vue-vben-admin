import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';

import { ProcurementReleaseService } from './procurement-release.service';

@Controller('procurement-release')
export class ProcurementReleaseController {
  constructor(private readonly procurementReleaseService: ProcurementReleaseService) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.procurementReleaseService.create(data, 'admin', requestContext);
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('applyNo') applyNo?: string,
    @Query('projectName') projectName?: string,
    @Query('releaseStatus') releaseStatus?: string,
    @Query('status') status?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.procurementReleaseService.findAll(
      {
        applyNo,
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        projectName,
        releaseStatus,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.procurementReleaseService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.procurementReleaseService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.procurementReleaseService.remove(BigInt(id));
  }
}

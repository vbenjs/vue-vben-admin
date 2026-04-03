import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';
import { ResearchFundArrivalService } from './research-fund-arrival.service';

@Controller('research/fund-arrival')
export class ResearchFundArrivalController {
  constructor(private readonly researchFundArrivalService: ResearchFundArrivalService) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.researchFundArrivalService.create(data, 'admin', requestContext);
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('payeeName') payeeName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('isReleased') isReleased?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.researchFundArrivalService.findAll(
      {
        fiscalYear,
        isReleased,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        payeeName,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchFundArrivalService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.researchFundArrivalService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.researchFundArrivalService.remove(BigInt(id));
  }
}

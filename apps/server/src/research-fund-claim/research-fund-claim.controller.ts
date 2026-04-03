import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';
import { ResearchFundClaimService } from './research-fund-claim.service';

@Controller('research/fund-claim')
export class ResearchFundClaimController {
  constructor(private readonly researchFundClaimService: ResearchFundClaimService) {}

  @Post()
  async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.researchFundClaimService.create(data, 'admin', requestContext);
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('projectName') projectName?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('isClaimed') isClaimed?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.researchFundClaimService.findAll(
      {
        fiscalYear,
        isClaimed,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        projectName,
        status,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.researchFundClaimService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.researchFundClaimService.update(BigInt(id), data, 'admin', requestContext);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.researchFundClaimService.remove(BigInt(id));
  }
}

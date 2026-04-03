import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ContractReleaseService } from './contract-release.service';
@Controller('contract-release')
export class ContractReleaseController {
  constructor(private readonly contractReleaseService: ContractReleaseService) {}
  @Post() async create(@Body() data: any, @RequestContext() requestContext: AppRequestContext) {
    return this.contractReleaseService.create(data, 'admin', requestContext);
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('contractName') contractName?: string,
    @Query('contractNo') contractNo?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('releaseStatus') releaseStatus?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.contractReleaseService.findAll(
      {
        contractName,
        contractNo,
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        releaseStatus,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.contractReleaseService.findOne(BigInt(id));
  }
  @Put(':id') async update(
    @Param('id') id: string,
    @Body() data: any,
    @RequestContext() requestContext: AppRequestContext,
  ) {
    return this.contractReleaseService.update(BigInt(id), data, 'admin', requestContext);
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.contractReleaseService.remove(BigInt(id));
  }
}

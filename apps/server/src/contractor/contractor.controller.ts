import type { AppRequestContext } from '../common/request-context/request-context.types';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestContext } from '../common/request-context/request-context.decorator';
import { ContractorService } from './contractor.service';
@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractorService: ContractorService) {}
  @Post() async create(@Body() data: any) {
    return this.contractorService.create(data, 'admin');
  }
  @Get('list') async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('contractorName') contractorName?: string,
    @Query('contractorType') contractorType?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @Query('status') status?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.contractorService.findAll(
      {
        contractorName,
        contractorType,
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        status,
      },
      requestContext,
    );
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    return this.contractorService.findOne(BigInt(id));
  }
  @Put(':id') async update(@Param('id') id: string, @Body() data: any) {
    return this.contractorService.update(BigInt(id), data, 'admin');
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    return this.contractorService.remove(BigInt(id));
  }
}

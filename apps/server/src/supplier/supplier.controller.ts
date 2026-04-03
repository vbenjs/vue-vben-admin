import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { RequestContext } from '../common/request-context/request-context.decorator';

import { SupplierService } from './supplier.service';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(@Body() data: any) {
    return this.supplierService.create(data, 'admin');
  }

  @Get('list')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('supplierCode') supplierCode?: string,
    @Query('supplierName') supplierName?: string,
    @Query('procureType') procureType?: string,
    @Query('status') status?: string,
    @Query('fiscalYear') fiscalYear?: string,
    @RequestContext() requestContext?: AppRequestContext,
  ) {
    return this.supplierService.findAll(
      {
        fiscalYear,
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 10,
        procureType,
        status,
        supplierCode,
        supplierName,
      },
      requestContext,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supplierService.findOne(BigInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.supplierService.update(BigInt(id), data, 'admin');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.supplierService.remove(BigInt(id));
  }
}

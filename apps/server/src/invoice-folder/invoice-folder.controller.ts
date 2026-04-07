import type { Request } from 'express';

import type { AppRequestContext } from '../common/request-context/request-context.types';

import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { InvoiceFolderService } from './invoice-folder.service';

type RequestWithContext = Request & {
  requestContext?: AppRequestContext;
};

@Controller('invoice-folder')
export class InvoiceFolderController {
  constructor(private readonly invoiceFolderService: InvoiceFolderService) {}

  @Post()
  async create(@Body() data: any, @Req() request: RequestWithContext) {
    return this.invoiceFolderService.create(data, request.requestContext);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.invoiceFolderService.getById(BigInt(id));
  }

  @Get('list')
  async getList(@Query() query: any) {
    const page = Number.parseInt(query.page || '1', 10);
    const pageSize = Number.parseInt(query.pageSize || '10', 10);
    return this.invoiceFolderService.getList(page, pageSize, query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.invoiceFolderService.remove(BigInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() request: RequestWithContext,
  ) {
    return this.invoiceFolderService.update(
      BigInt(id),
      data,
      request.requestContext,
    );
  }
}

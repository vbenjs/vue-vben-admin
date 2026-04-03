import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { InvoiceFolderService } from './invoice-folder.service';

@Controller('invoice-folder')
export class InvoiceFolderController {
  constructor(private readonly invoiceFolderService: InvoiceFolderService) {}

  @Post()
  async create(@Body() data: any) {
    return this.invoiceFolderService.create(data);
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
  async update(@Param('id') id: string, @Body() data: any) {
    return this.invoiceFolderService.update(BigInt(id), data);
  }
}

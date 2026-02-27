import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { SysPrintDesignService } from './sys-print-design.service';

@Controller('sys/print-design')
export class SysPrintDesignController {
  constructor(private readonly sysPrintDesignService: SysPrintDesignService) {}

  @Get('list')
  async findAll(@Query('page') page: string = '1', @Query('pageSize') pageSize: string = '10', @Query('printName') printName?: string, @Query('status') status?: string) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysPrintDesignService.findAll({ skip, take, printName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysPrintDesignService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin';
    return this.sysPrintDesignService.create(createDto, username);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysPrintDesignService.update(+id, updateDto, username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysPrintDesignService.remove(+id);
  }
}

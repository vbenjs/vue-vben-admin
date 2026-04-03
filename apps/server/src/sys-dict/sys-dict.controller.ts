import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';

import { SysDictService } from './sys-dict.service';

@Controller('sys/dict')
export class SysDictController {
  constructor(private readonly sysDictService: SysDictService) {}

  @Post('data')
  async createData(@Body() data: any, @Headers('x-user-name') username: string) {
    return this.sysDictService.createData(data, username || 'admin');
  }

  @Post('type')
  async createType(@Body() data: any, @Headers('x-user-name') username: string) {
    return this.sysDictService.createType(data, username || 'admin');
  }

  @Post('bootstrap/finance-base')
  async bootstrapFinanceBase(@Headers('x-user-name') username: string) {
    return this.sysDictService.ensureFinanceBaseData(username || 'admin');
  }

  @Get('data/type/:dictType')
  async getByType(@Param('dictType') dictType: string) {
    return this.sysDictService.getDictDataByType(dictType);
  }

  // ==================== Dict Data ====================
  @Get('data/list')
  async getDataList(@Query() query: any) {
    return this.sysDictService.getDataList(query);
  }

  // ==================== Dict Type ====================
  @Get('type/list')
  async getTypeList(@Query() query: any) {
    return this.sysDictService.getTypeList(query);
  }

  @Delete('data/:id')
  async removeData(@Param('id') id: string) {
    return this.sysDictService.removeData(id);
  }

  @Delete('type/:id')
  async removeType(@Param('id') id: string) {
    return this.sysDictService.removeType(id);
  }

  @Put('data/:id')
  async updateData(
    @Param('id') id: string,
    @Body() data: any,
    @Headers('x-user-name') username: string,
  ) {
    return this.sysDictService.updateData(id, data, username || 'admin');
  }

  @Put('type/:id')
  async updateType(
    @Param('id') id: string,
    @Body() data: any,
    @Headers('x-user-name') username: string,
  ) {
    return this.sysDictService.updateType(id, data, username || 'admin');
  }
}

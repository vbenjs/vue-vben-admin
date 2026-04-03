import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';

import { SysGenService } from './sys-gen.service';

@Controller('sys-gen')
export class SysGenController {
  constructor(private readonly sysGenService: SysGenService) {}

  // 6. 删除已导入的表
  @Delete(':tableIds')
  async deleteTables(@Param('tableIds') tableIds: string) {
    const ids = tableIds.split(',').map((id) => id.trim());
    return this.sysGenService.deleteTables(ids);
  }

  // 9. 执行代码生成并写入磁盘
  @Post('generate/:tableId')
  async generateCode(@Param('tableId') tableId: string) {
    return this.sysGenService.executeCodeGeneration(tableId);
  }

  // 1. 获取所有数据库表（供导入使用）
  @Get('db/tables')
  async getDbTables(
    @Query('tableName') tableName?: string,
    @Query('tableComment') tableComment?: string,
  ) {
    return this.sysGenService.getDbTables(tableName, tableComment);
  }

  // 4. 获取生成表详情及列信息
  @Get(':tableId')
  async getGenTableDetail(@Param('tableId') tableId: string) {
    return this.sysGenService.getTableDetail(tableId);
  }

  // 3. 获取已导入的生成表列表
  @Get('list')
  async getGenTables(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('tableName') tableName?: string,
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysGenService.findAll({ skip, take, tableName });
  }

  // 2. 导入选中的表
  @Post('import')
  async importTables(@Body() data: { tables: string[] }, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.sysGenService.importTables(data.tables, username);
  }

  // 8. 预览生成代码
  @Get('preview/:tableId')
  async previewCode(@Param('tableId') tableId: string) {
    return this.sysGenService.previewCode(tableId);
  }

  // 7. 同步数据库结构
  @Post('sync/:tableId')
  async syncTable(@Param('tableId') tableId: string, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.sysGenService.syncTable(tableId, username);
  }

  // 5. 更新生成配置
  @Put()
  async updateConfig(@Body() updateData: any, @Request() req) {
    const username = req.user?.username || 'admin';
    return this.sysGenService.updateConfig(updateData, username);
  }
}

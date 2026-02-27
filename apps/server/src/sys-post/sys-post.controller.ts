import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { SysPostService } from './sys-post.service';

@Controller('sys/post')
export class SysPostController {
  constructor(private readonly sysPostService: SysPostService) {}

  @Get('list')
  async findAll(
    @Query('page') page: string = '1', 
    @Query('pageSize') pageSize: string = '10', 
    @Query('postCode') postCode?: string,
    @Query('postName') postName?: string,
    @Query('status') status?: string
  ) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    return this.sysPostService.findAll({ skip, take, postCode, postName, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sysPostService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: any) {
    const username = 'admin'; 
    return this.sysPostService.create(createDto, username);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const username = 'admin';
    return this.sysPostService.update(+id, updateDto, username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sysPostService.remove(+id);
  }
}

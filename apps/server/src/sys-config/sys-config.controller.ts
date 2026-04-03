import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { SysConfigService } from './sys-config.service';

@Controller('sys/config')
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @Get('global')
  async getGlobal() {
    return this.sysConfigService.getGlobalConfig();
  }

  @Get('group/:group')
  async getGroup(@Param('group') group: string) {
    return this.sysConfigService.getConfigGroup(group);
  }

  @Post('save')
  async save(@Body() configs: Record<string, string>) {
    return this.sysConfigService.saveConfig(configs);
  }

  @Post('group/:group')
  async saveGroup(@Param('group') group: string, @Body() configs: Record<string, string>) {
    return this.sysConfigService.saveConfigGroup(group, configs);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { SysConfigService } from './sys-config.service';

@Controller('sys/config')
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @Get('global')
  async getGlobal() {
    return this.sysConfigService.getGlobalConfig();
  }

  @Post('save')
  async save(@Body() configs: Record<string, string>) {
    return this.sysConfigService.saveConfig(configs);
  }
}

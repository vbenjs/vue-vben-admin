import { Module } from '@nestjs/common';
import { SysConfigController } from './sys-config.controller';
import { SysConfigService } from './sys-config.service';

@Module({
  controllers: [SysConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}

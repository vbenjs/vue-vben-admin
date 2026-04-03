import { Module } from '@nestjs/common';

import { SysOperLogController } from './sys-oper-log.controller';
import { SysOperLogService } from './sys-oper-log.service';

@Module({
  controllers: [SysOperLogController],
  providers: [SysOperLogService],
})
export class SysOperLogModule {}

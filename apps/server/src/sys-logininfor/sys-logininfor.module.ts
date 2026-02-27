import { Module } from '@nestjs/common';
import { SysLogininforController } from './sys-logininfor.controller';
import { SysLogininforService } from './sys-logininfor.service';

@Module({
  controllers: [SysLogininforController],
  providers: [SysLogininforService]
})
export class SysLogininforModule {}

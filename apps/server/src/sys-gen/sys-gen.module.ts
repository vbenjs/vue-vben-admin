import { Module } from '@nestjs/common';

import { SysGenController } from './sys-gen.controller';
import { SysGenService } from './sys-gen.service';

@Module({
  controllers: [SysGenController],
  providers: [SysGenService],
  exports: [SysGenService],
})
export class SysGenModule {}

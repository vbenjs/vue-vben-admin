import { Module } from '@nestjs/common';
import { SysDocCodeController } from './sys-doc-code.controller';
import { SysDocCodeService } from './sys-doc-code.service';

@Module({
  controllers: [SysDocCodeController],
  providers: [SysDocCodeService]
})
export class SysDocCodeModule {}

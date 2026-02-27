import { Module } from '@nestjs/common';
import { SysApprovalProcessController } from './sys-approval-process.controller';
import { SysApprovalProcessService } from './sys-approval-process.service';

@Module({
  controllers: [SysApprovalProcessController],
  providers: [SysApprovalProcessService]
})
export class SysApprovalProcessModule {}

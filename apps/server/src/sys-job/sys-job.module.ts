import { Module } from '@nestjs/common';
import { SysJobController } from './sys-job.controller';
import { SysJobService } from './sys-job.service';

@Module({
  controllers: [SysJobController],
  providers: [SysJobService]
})
export class SysJobModule {}

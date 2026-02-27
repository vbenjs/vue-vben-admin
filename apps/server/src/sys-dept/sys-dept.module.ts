import { Module } from '@nestjs/common';
import { SysDeptController } from './sys-dept.controller';
import { SysDeptService } from './sys-dept.service';

@Module({
  controllers: [SysDeptController],
  providers: [SysDeptService]
})
export class SysDeptModule {}

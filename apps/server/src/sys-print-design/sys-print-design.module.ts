import { Module } from '@nestjs/common';
import { SysPrintDesignController } from './sys-print-design.controller';
import { SysPrintDesignService } from './sys-print-design.service';

@Module({
  controllers: [SysPrintDesignController],
  providers: [SysPrintDesignService]
})
export class SysPrintDesignModule {}

import { Module } from '@nestjs/common';

import { SysPrintDesignController } from './sys-printDesign.controller';
import { SysPrintDesignService } from './sys-printDesign.service';

@Module({
  controllers: [SysPrintDesignController],
  providers: [SysPrintDesignService],
})
export class SysPrintDesignModule {}

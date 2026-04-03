import { Module } from '@nestjs/common';

import { SysFormDataController } from './sys-form-data.controller';
import { SysFormDataService } from './sys-form-data.service';

@Module({
  controllers: [SysFormDataController],
  providers: [SysFormDataService],
  exports: [SysFormDataService],
})
export class SysFormDataModule {}

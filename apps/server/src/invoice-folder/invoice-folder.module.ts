import { Module } from '@nestjs/common';

import { SysFormDataModule } from '../sys-form-data/sys-form-data.module';
import { InvoiceFolderController } from './invoice-folder.controller';
import { InvoiceFolderService } from './invoice-folder.service';

@Module({
  imports: [SysFormDataModule],
  controllers: [InvoiceFolderController],
  providers: [InvoiceFolderService],
  exports: [InvoiceFolderService],
})
export class InvoiceFolderModule {}

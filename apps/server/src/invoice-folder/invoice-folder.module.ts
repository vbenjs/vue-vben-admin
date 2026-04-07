import { Module } from '@nestjs/common';

import { SysFormDataModule } from '../sys-form-data/sys-form-data.module';
import { SysTenantPolicyModule } from '../sys-tenant-policy/sys-tenant-policy.module';
import { InvoiceFolderController } from './invoice-folder.controller';
import { InvoiceFolderService } from './invoice-folder.service';

@Module({
  imports: [SysFormDataModule, SysTenantPolicyModule],
  controllers: [InvoiceFolderController],
  providers: [InvoiceFolderService],
  exports: [InvoiceFolderService],
})
export class InvoiceFolderModule {}

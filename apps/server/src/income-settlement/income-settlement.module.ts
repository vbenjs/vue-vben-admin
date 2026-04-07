import { Module } from '@nestjs/common';

import { InvoiceFolderModule } from '../invoice-folder/invoice-folder.module';
import { SysFormDataModule } from '../sys-form-data/sys-form-data.module';
import { SysTenantPolicyModule } from '../sys-tenant-policy/sys-tenant-policy.module';
import { IncomeSettlementController } from './income-settlement.controller';
import { IncomeSettlementService } from './income-settlement.service';

@Module({
  imports: [SysFormDataModule, InvoiceFolderModule, SysTenantPolicyModule],
  controllers: [IncomeSettlementController],
  providers: [IncomeSettlementService],
  exports: [IncomeSettlementService],
})
export class IncomeSettlementModule {}

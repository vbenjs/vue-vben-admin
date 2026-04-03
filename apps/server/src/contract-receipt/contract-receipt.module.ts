import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ContractReceiptController } from './contract-receipt.controller';
import { ContractReceiptService } from './contract-receipt.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ContractReceiptController],
  providers: [ContractReceiptService],
})
export class ContractReceiptModule {}

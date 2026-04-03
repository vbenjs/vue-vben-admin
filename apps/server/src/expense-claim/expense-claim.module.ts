import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { InvoiceFolderModule } from '../invoice-folder/invoice-folder.module';
import { ExpenseClaimController } from './expense-claim.controller';
import { ExpenseClaimService } from './expense-claim.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule, InvoiceFolderModule],
  controllers: [ExpenseClaimController],
  providers: [ExpenseClaimService],
})
export class ExpenseClaimModule {}

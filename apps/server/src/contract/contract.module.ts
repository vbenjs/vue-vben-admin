import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}

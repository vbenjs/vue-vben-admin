import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ProcurementApplyController } from './procurement-apply.controller';
import { ProcurementApplyService } from './procurement-apply.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ProcurementApplyController],
  providers: [ProcurementApplyService],
})
export class ProcurementApplyModule {}

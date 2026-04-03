import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ProcurementResultController } from './procurement-result.controller';
import { ProcurementResultService } from './procurement-result.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ProcurementResultController],
  providers: [ProcurementResultService],
})
export class ProcurementResultModule {}

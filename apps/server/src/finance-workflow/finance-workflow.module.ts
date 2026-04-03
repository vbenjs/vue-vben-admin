import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { LegacySqlModule } from '../legacy-sql/legacy-sql.module';
import { FinanceWorkflowController } from './finance-workflow.controller';
import { FinanceWorkflowService } from './finance-workflow.service';

@Module({
  imports: [AuthModule, LegacySqlModule],
  controllers: [FinanceWorkflowController],
  providers: [FinanceWorkflowService],
  exports: [FinanceWorkflowService],
})
export class FinanceWorkflowModule {}

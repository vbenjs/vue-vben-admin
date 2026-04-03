import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { AuthAdjustApplyController } from './auth-adjust-apply.controller';
import { AuthAdjustApplyService } from './auth-adjust-apply.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [AuthAdjustApplyController],
  providers: [AuthAdjustApplyService],
  exports: [AuthAdjustApplyService],
})
export class AuthAdjustApplyModule {}

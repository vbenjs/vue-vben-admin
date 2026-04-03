import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ResearchIndicatorController } from './research-indicator.controller';
import { ResearchIndicatorService } from './research-indicator.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ResearchIndicatorController],
  providers: [ResearchIndicatorService],
})
export class ResearchIndicatorModule {}

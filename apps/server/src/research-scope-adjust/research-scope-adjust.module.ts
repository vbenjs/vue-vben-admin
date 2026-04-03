import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ResearchScopeAdjustController } from './research-scope-adjust.controller';
import { ResearchScopeAdjustService } from './research-scope-adjust.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ResearchScopeAdjustController],
  providers: [ResearchScopeAdjustService],
})
export class ResearchScopeAdjustModule {}

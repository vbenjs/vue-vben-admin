import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { ResearchProjectController } from './research-project.controller';
import { ResearchProjectService } from './research-project.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [ResearchProjectController],
  providers: [ResearchProjectService],
})
export class ResearchProjectModule {}

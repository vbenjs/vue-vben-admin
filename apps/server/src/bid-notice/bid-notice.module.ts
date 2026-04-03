import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FinanceWorkflowModule } from '../finance-workflow/finance-workflow.module';
import { BidNoticeController } from './bid-notice.controller';
import { BidNoticeService } from './bid-notice.service';

@Module({
  imports: [AuthModule, FinanceWorkflowModule],
  controllers: [BidNoticeController],
  providers: [BidNoticeService],
})
export class BidNoticeModule {}

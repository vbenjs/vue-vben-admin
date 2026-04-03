import { Module } from '@nestjs/common';

import { LegacySqlModule } from '../legacy-sql/legacy-sql.module';
import { FinanceReimbursementController } from './finance-reimbursement.controller';
import { FinanceReimbursementService } from './finance-reimbursement.service';

@Module({
  imports: [LegacySqlModule],
  controllers: [FinanceReimbursementController],
  providers: [FinanceReimbursementService],
})
export class FinanceReimbursementModule {}

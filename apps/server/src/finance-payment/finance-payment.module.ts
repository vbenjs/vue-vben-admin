import { Module } from '@nestjs/common';

import { LegacySqlModule } from '../legacy-sql/legacy-sql.module';
import { FinancePaymentController } from './finance-payment.controller';
import { FinancePaymentService } from './finance-payment.service';

@Module({
  imports: [LegacySqlModule],
  controllers: [FinancePaymentController],
  providers: [FinancePaymentService],
})
export class FinancePaymentModule {}

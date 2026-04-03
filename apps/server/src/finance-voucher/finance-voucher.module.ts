import { Module } from '@nestjs/common';

import { LegacySqlModule } from '../legacy-sql/legacy-sql.module';
import { FinanceVoucherController } from './finance-voucher.controller';
import { FinanceVoucherService } from './finance-voucher.service';

@Module({
  imports: [LegacySqlModule],
  controllers: [FinanceVoucherController],
  providers: [FinanceVoucherService],
})
export class FinanceVoucherModule {}

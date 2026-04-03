import { Module } from '@nestjs/common';

import { BudgetIndicatorController } from './budget-indicator.controller';
import { BudgetIndicatorService } from './budget-indicator.service';

@Module({
  controllers: [BudgetIndicatorController],
  providers: [BudgetIndicatorService],
  exports: [BudgetIndicatorService],
})
export class BudgetIndicatorModule {}

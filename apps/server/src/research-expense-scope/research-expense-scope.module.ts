import { Module } from '@nestjs/common';

import { ResearchExpenseScopeController } from './research-expense-scope.controller';
import { ResearchExpenseScopeService } from './research-expense-scope.service';

@Module({
  controllers: [ResearchExpenseScopeController],
  providers: [ResearchExpenseScopeService],
})
export class ResearchExpenseScopeModule {}

import { Module } from '@nestjs/common';
import { ExpenseClaimDetailController } from './expense-claim-detail.controller';
import { ExpenseClaimDetailService } from './expense-claim-detail.service';
@Module({ controllers: [ExpenseClaimDetailController], providers: [ExpenseClaimDetailService] })
export class ExpenseClaimDetailModule {}

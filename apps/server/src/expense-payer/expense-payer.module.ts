import { Module } from '@nestjs/common';
import { ExpensePayerController } from './expense-payer.controller';
import { ExpensePayerService } from './expense-payer.service';
@Module({ controllers: [ExpensePayerController], providers: [ExpensePayerService] })
export class ExpensePayerModule {}

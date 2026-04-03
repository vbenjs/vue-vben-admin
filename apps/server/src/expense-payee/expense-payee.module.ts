import { Module } from '@nestjs/common';
import { ExpensePayeeController } from './expense-payee.controller';
import { ExpensePayeeService } from './expense-payee.service';
@Module({ controllers: [ExpensePayeeController], providers: [ExpensePayeeService] })
export class ExpensePayeeModule {}

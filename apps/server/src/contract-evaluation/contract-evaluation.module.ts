import { Module } from '@nestjs/common';
import { ContractEvaluationController } from './contract-evaluation.controller';
import { ContractEvaluationService } from './contract-evaluation.service';
@Module({ controllers: [ContractEvaluationController], providers: [ContractEvaluationService] })
export class ContractEvaluationModule {}

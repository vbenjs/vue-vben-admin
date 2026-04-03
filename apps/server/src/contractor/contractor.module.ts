import { Module } from '@nestjs/common';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
@Module({ controllers: [ContractorController], providers: [ContractorService] })
export class ContractorModule {}

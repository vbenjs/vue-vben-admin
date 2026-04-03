import { Module } from '@nestjs/common';
import { ContractReleaseController } from './contract-release.controller';
import { ContractReleaseService } from './contract-release.service';
@Module({ controllers: [ContractReleaseController], providers: [ContractReleaseService] })
export class ContractReleaseModule {}

import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
@Module({ controllers: [ExpertController], providers: [ExpertService] })
export class ExpertModule {}

import { Module } from '@nestjs/common';
import { EngineeringProjectController } from './engineering-project.controller';
import { EngineeringProjectService } from './engineering-project.service';
@Module({ controllers: [EngineeringProjectController], providers: [EngineeringProjectService] })
export class EngineeringProjectModule {}

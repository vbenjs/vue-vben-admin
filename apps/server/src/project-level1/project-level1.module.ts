import { Module } from '@nestjs/common';

import { ProjectLevel1Controller } from './project-level1.controller';
import { ProjectLevel1Service } from './project-level1.service';

@Module({
  controllers: [ProjectLevel1Controller],
  providers: [ProjectLevel1Service],
  exports: [ProjectLevel1Service],
})
export class ProjectLevel1Module {}

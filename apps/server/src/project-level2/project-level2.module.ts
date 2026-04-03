import { Module } from '@nestjs/common';

import { ProjectLevel2Controller } from './project-level2.controller';
import { ProjectLevel2Service } from './project-level2.service';

@Module({
  controllers: [ProjectLevel2Controller],
  providers: [ProjectLevel2Service],
  exports: [ProjectLevel2Service],
})
export class ProjectLevel2Module {}

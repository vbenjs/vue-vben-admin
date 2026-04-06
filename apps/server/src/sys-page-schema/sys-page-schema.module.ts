import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SysPageSchemaController } from './sys-page-schema.controller';
import { SysPageSchemaService } from './sys-page-schema.service';

@Module({
  imports: [AuthModule],
  controllers: [SysPageSchemaController],
  providers: [SysPageSchemaService],
  exports: [SysPageSchemaService],
})
export class SysPageSchemaModule {}

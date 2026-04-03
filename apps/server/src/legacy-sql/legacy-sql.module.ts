import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { LegacySqlConnectionFactory } from './legacy-sql.connection-factory';
import { LegacySqlController } from './legacy-sql.controller';
import { LegacySqlService } from './legacy-sql.service';

@Module({
  imports: [AuthModule],
  controllers: [LegacySqlController],
  providers: [LegacySqlConnectionFactory, LegacySqlService],
  exports: [LegacySqlConnectionFactory, LegacySqlService],
})
export class LegacySqlModule {}
